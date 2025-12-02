import type { Metadata } from "next";
import "./globals.css";
import { Geologica } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/src/i18n/routing";
import { notFound } from "next/navigation";
import { ThemeProvider } from "@/src/components/theme-provider";
import Nav from "@/src/components/nav";
import Footer from "@/src/components/footer";
import { setRequestLocale } from "next-intl/server";
import { VisibilityProvider } from "@/src/contexts/visibility-provider";
import TransitionWrapper from "@/src/components/transition-wrapper";
import { ReduxProvider } from "@/src/components/redux-provider";

export const metadata: Metadata = {
  title: "alee - coming soon",
  description: "alee - Coming Soon",
  manifest: "/site.webmanifest",
};

const geologica = Geologica({
  weight: ["400", "500", "700"],
  display: "swap",
  subsets: ["latin", "cyrillic", "latin-ext", "cyrillic-ext"],
  variable: "--font-work-comfortaa",
  preload: true,
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
      <body suppressHydrationWarning className="bg-background text-primary">
        <ReduxProvider>
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
        </ReduxProvider>
      </body>
    </html>
  );
}
