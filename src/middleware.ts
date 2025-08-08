import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, defaultLocale, locales } from "@/src/config-locale";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});

export default function middleware(request: NextRequest) {
  // Check if there's a locale cookie
  const cookieLocale = request.cookies.get(COOKIE_NAME)?.value;

  // Get the pathname
  const pathname = request.nextUrl.pathname;

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  // With "as-needed", only redirect to non-default locales
  // If there's a cookie locale and it's NOT the default locale and pathname doesn't have a locale
  if (
    cookieLocale &&
    locales.includes(cookieLocale as any) &&
    cookieLocale !== defaultLocale && // Only redirect for non-default locales
    !pathnameHasLocale &&
    pathname !== "/"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `/${cookieLocale}${pathname}`;
    return NextResponse.redirect(url);
  }

  // Run the default intl middleware
  const response = intlMiddleware(request);

  // If user is switching locales via URL, update the cookie
  if (pathnameHasLocale) {
    const localeFromPath = pathname.split("/")[1];
    if (
      locales.includes(localeFromPath as any) &&
      localeFromPath !== cookieLocale
    ) {
      response.cookies.set(COOKIE_NAME, localeFromPath, {
        maxAge: 365 * 24 * 60 * 60, // 1 year
        httpOnly: false, // Allow client-side access for language switcher
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }
  } else if (!pathnameHasLocale && pathname !== "/") {
    // For routes without locale prefix, set the default locale cookie if none exists
    if (!cookieLocale) {
      response.cookies.set(COOKIE_NAME, defaultLocale, {
        maxAge: 365 * 24 * 60 * 60, // 1 year
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    "/",
    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    "/(en|az|ru)/:path*",
    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
