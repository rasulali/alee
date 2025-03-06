import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from 'next/font/google'
import { ThemeProvider } from "../components/theme-provider";

export const metadata: Metadata = {
  title: "alee - coming soon",
  description: "alee - Coming Soon",
  manifest: "/site.webmanifest",
};

const montserrat = Montserrat({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-montserrat',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/icon.svg" as="image" type="image/svg+xml" fetchPriority="high" />
        <link rel="preload" href="/apple-touch-icon.png" as="image" fetchPriority="high" />

        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <link
          rel="preload"
          href="/_next/static/media/montserrat-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
          fetchPriority="high"
        />

        <meta httpEquiv="Content-Security-Policy" content="default-src 'self' data: 'unsafe-inline' 'unsafe-eval'" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      </head>
      <body className={montserrat.variable}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="alee-theme"
          enableColorScheme
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
