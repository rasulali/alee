import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import {
  COOKIE_NAME,
  Locale,
  defaultLocale,
  locales,
} from "@/src/config-locale";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});

const isLocale = (value: string | undefined): value is Locale =>
  locales.some((locale) => locale === value);

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for auth callback
  if (pathname.startsWith("/auth/callback")) {
    return NextResponse.next();
  }

  const cookieLocale = request.cookies.get(COOKIE_NAME)?.value;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  // Handle locale redirects
  if (
    cookieLocale &&
    isLocale(cookieLocale) &&
    cookieLocale !== defaultLocale &&
    !pathnameHasLocale &&
    pathname !== "/"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `/${cookieLocale}${pathname}`;
    return NextResponse.redirect(url);
  }

  // Get the intl response
  const response = intlMiddleware(request);

  // Update locale cookies
  if (pathnameHasLocale) {
    const localeFromPath = pathname.split("/")[1];
    if (
      isLocale(localeFromPath) &&
      localeFromPath !== cookieLocale
    ) {
      response.cookies.set(COOKIE_NAME, localeFromPath, {
        maxAge: 365 * 24 * 60 * 60,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }
  } else if (!pathnameHasLocale && pathname !== "/") {
    if (!cookieLocale) {
      response.cookies.set(COOKIE_NAME, defaultLocale, {
        maxAge: 365 * 24 * 60 * 60,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }
  }

  // Check if the path is an admin route (with or without locale)
  const isAdminRoute = pathname.includes("/admin");
  const isLoginRoute = pathname.includes("/login");
  const isAuthCallback = pathname.includes("/auth/callback");

  // Skip auth check for login and callback routes
  if (isLoginRoute || isAuthCallback) {
    return response;
  }

  // Handle auth for admin routes
  if (isAdminRoute) {
    const { response: updatedResponse, user } = await updateSession(
      request,
      response,
    );

    if (!user) {
      // Redirect to login with locale
      const locale = pathnameHasLocale
        ? pathname.split("/")[1]
        : cookieLocale || defaultLocale;
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return updatedResponse;
  }

  // Update session for all other routes
  const { response: updatedResponse } = await updateSession(request, response);
  return updatedResponse;
}

export const config = {
  matcher: ["/", "/(en|az|ru)/:path*", "/((?!_next|_vercel|.*\\..*).*)"],
};
