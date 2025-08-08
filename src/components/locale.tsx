import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { COOKIE_NAME } from "@/src/config-locale";

interface LocaleLinkProps {
  locale: string;
  children: React.ReactNode;
}

export function LocaleLink({ locale, children }: LocaleLinkProps) {
  const currentLocale = useLocale();
  const pathname = usePathname();

  let href = pathname;
  if (pathname.startsWith(`/${currentLocale}`)) {
    href = pathname.slice(`/${currentLocale}`.length) || "/";
  }

  href = `/${locale}${href === "/" ? "" : href}`;

  const handleClick = () => {
    document.cookie = `${COOKIE_NAME}=${locale}; max-age=${365 * 24 * 60 * 60}; path=/; samesite=lax`;
  };

  return (
    <Link href={href} onClick={handleClick} hrefLang={locale}>
      {children}
    </Link>
  );
}
