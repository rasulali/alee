import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";
import { hasLocale } from "next-intl";
import {
  COOKIE_NAME,
  Locale,
  defaultLocale,
  locales,
} from "@/src/config-locale";
import { parseCookieHeader } from "@/lib/utils";

export default getRequestConfig(async ({ requestLocale }) => {
  let requested = await requestLocale;

  if (!requested) {
    const headersList = await headers();
    const cookieHeader = headersList.get("cookie");

    if (cookieHeader) {
      const cookies = parseCookieHeader(cookieHeader);
      requested = cookies[COOKIE_NAME];
    }

    if (!requested) {
      const acceptLanguage = headersList.get("accept-language");
      if (acceptLanguage) {
        const languages = acceptLanguage
          .split(",")
          .map((lang) => lang.split(";")[0].trim().toLowerCase())
          .map((lang) => lang.split("-")[0]);

        const matchedLocale = locales.find((locale) =>
          languages.includes(locale),
        );

        if (matchedLocale) {
          requested = matchedLocale as Locale;
        }
      }
    }
  }

  const locale = hasLocale(locales, requested) ? requested : defaultLocale;
  const common = (await import(`../../messages/${locale}/common.json`)).default;

  return {
    locale,
    messages: { ...common },
  };
});
