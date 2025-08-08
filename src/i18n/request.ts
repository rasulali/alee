import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";
import { hasLocale } from "next-intl";
import { COOKIE_NAME, defaultLocale, locales } from "@/src/config-locale";

export default getRequestConfig(async ({ requestLocale }) => {
  let requested = await requestLocale;

  // If no locale from routing, check cookie first, then browser preference
  if (!requested) {
    const headersList = await headers();
    const cookieHeader = headersList.get("cookie");

    if (cookieHeader) {
      const cookies = cookieHeader.split(";").reduce(
        (acc, cookie) => {
          const [key, value] = cookie.trim().split("=");
          acc[key] = value;
          return acc;
        },
        {} as Record<string, string>,
      );

      requested = cookies[COOKIE_NAME];
    }

    // If still no locale, fall back to Accept-Language header
    if (!requested) {
      const acceptLanguage = headersList.get("accept-language");
      if (acceptLanguage) {
        // Parse Accept-Language header to find the best match
        const languages = acceptLanguage
          .split(",")
          .map((lang) => lang.split(";")[0].trim().toLowerCase())
          .map((lang) => lang.split("-")[0]); // Extract language code only

        requested = languages.find((lang) => locales.includes(lang as any));
      }
    }
  }

  const locale = hasLocale(locales, requested) ? requested : defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
