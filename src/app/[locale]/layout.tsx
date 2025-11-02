import type { Metadata } from "next";
import "./globals.css";
import { Mrs_Saint_Delafield, Geologica } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/src/i18n/routing";
import { notFound } from "next/navigation";
import { ThemeProvider } from "@/src/components/theme-provider";
import Nav from "@/src/components/nav";
import Footer from "@/src/components/footer";
import { setRequestLocale } from "next-intl/server";
import { VisibilityProvider } from "@/src/contexts/visibility-provider";
import TransitionWrapper from "@/src/components/transition-wrapper";

export const metadata: Metadata = {
  title: "alee - coming soon",
  description: "alee - Coming Soon",
  manifest: "/site.webmanifest",
};

const geologica = Geologica({
  weight: "variable",
  display: "swap",
  subsets: ["latin", "cyrillic", "latin-ext", "cyrillic-ext"],
  variable: "--font-work-comfortaa",
  preload: true,
  adjustFontFallback: true,
});

const handwrite = Mrs_Saint_Delafield({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-handwrite",
  adjustFontFallback: true,
});

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const common = (await import(`@/messages/${locale}/common.json`)).default;

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={geologica.className}
    >
      <body
        suppressHydrationWarning
        className={`${handwrite.variable} bg-background text-primary`}
      >
        <NextIntlClientProvider
          locale={locale}
          messages={{
            ...common,
          }}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="alee-theme"
            enableColorScheme
          >
            <VisibilityProvider>
              <Nav />
              <TransitionWrapper>{children}</TransitionWrapper>
              <Footer />
            </VisibilityProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
