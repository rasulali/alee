"use client";

import { useLocale } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { COOKIE_NAME } from "@/src/config-locale";

interface LocaleLinkProps {
  locale: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export function LocaleLink({
  locale,
  className,
  children,
  onClick,
}: LocaleLinkProps) {
  const currentLocale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  let pathWithoutLocale = pathname;
  if (pathname.startsWith(`/${currentLocale}`)) {
    pathWithoutLocale = pathname.slice(`/${currentLocale}`.length) || "/";
  }

  const queryString = searchParams.toString();
  const search = queryString ? `?${queryString}` : "";

  const href = `/${locale}${pathWithoutLocale}${search}`;

  const handleClick = () => {
    document.cookie = `${COOKIE_NAME}=${locale}; max-age=${
      365 * 24 * 60 * 60
    }; path=/; samesite=lax`;
    onClick?.();
  };

  return (
    <Link
      rel="noopener noreferrer"
      aria-label={`Change to ${locale} language`}
      href={href}
      onClick={handleClick}
      hrefLang={locale}
      className={className}
      aria-current={currentLocale === locale ? "true" : undefined}
    >
      {children}
    </Link>
  );
}
