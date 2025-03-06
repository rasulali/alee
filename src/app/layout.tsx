import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from 'next/font/google'
import { ThemeProvider } from "../components/theme-provider";

export const metadata: Metadata = {
  title: "alee - coming soon",
  description: "",
  manifest: "/site.webmanifest",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ebeae6" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
};

const montserrat = Montserrat({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-montserrat',
  adjustFontFallback: false,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload Critical Icons */}
        <link rel="preload" href="/icon.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/apple-touch-icon.png" as="image" />

        {/* Font Preloading */}
        <link
          rel="preload"
          href="/_next/static/media/montserrat-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className={montserrat.variable}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="alee-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
