import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { DM_Sans } from 'next/font/google'
import { Mrs_Saint_Delafield } from 'next/font/google'
import { getLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import Nav from "../components/nav";

export const metadata: Metadata = {
  title: "alee - coming soon",
  description: "alee - Coming Soon",
  manifest: "/site.webmanifest",
};

const dmSans = DM_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-work-sans",
  adjustFontFallback: true
})

const handwrite = Mrs_Saint_Delafield({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-handwrite',
  adjustFontFallback: true,
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale} suppressHydrationWarning className={dmSans.className}>
      <head>
        <link rel="preload" href="/icon.svg" as="image" type="image/svg+xml" fetchPriority="high" />
      </head>
      <body suppressHydrationWarning className={`${handwrite.variable} bg-background text-primary`}>
        <NextIntlClientProvider locale={locale}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="alee-theme"
            enableColorScheme
          >
            <Nav />
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
