import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, defaultLocale, locales } from "@/src/config-locale";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});
type Locales = "az" | "en" | "ru";

export default function proxy(request: NextRequest) {
  const cookieLocale = request.cookies.get(COOKIE_NAME)?.value;
  const pathname = request.nextUrl.pathname;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (
    cookieLocale &&
    locales.includes(cookieLocale as Locales) &&
    cookieLocale !== defaultLocale &&
    !pathnameHasLocale &&
    pathname !== "/"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `/${cookieLocale}${pathname}`;
    return NextResponse.redirect(url);
  }

  const response = intlMiddleware(request);

  if (pathnameHasLocale) {
    const localeFromPath = pathname.split("/")[1];
    if (
      locales.includes(localeFromPath as Locales) &&
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

  return response;
}

export const config = {
  matcher: ["/", "/(en|az|ru)/:path*", "/((?!_next|_vercel|.*\\..*).*)"],
};
