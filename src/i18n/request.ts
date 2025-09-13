import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";
import { hasLocale } from "next-intl";
import { COOKIE_NAME, defaultLocale, locales } from "@/src/config-locale";

export default getRequestConfig(async ({ requestLocale }) => {
  let requested = await requestLocale;

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

    if (!requested) {
      const acceptLanguage = headersList.get("accept-language");
      if (acceptLanguage) {
        const languages = acceptLanguage
          .split(",")
          .map((lang) => lang.split(";")[0].trim().toLowerCase())
          .map((lang) => lang.split("-")[0]);

        requested = languages.find((lang) => locales.includes(lang as any));
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
