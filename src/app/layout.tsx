import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { Work_Sans } from 'next/font/google'
import { Mrs_Saint_Delafield } from 'next/font/google'

export const metadata: Metadata = {
  title: "alee - coming soon",
  description: "alee - Coming Soon",
  manifest: "/site.webmanifest",
};

const workSans = Work_Sans({
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={workSans.className}>
      <head>
        <link rel="preload" href="/icon.svg" as="image" type="image/svg+xml" fetchPriority="high" />
        <link rel="preload" href="/apple-touch-icon.png" as="image" fetchPriority="high" />
      </head>
      <body className={`${handwrite.variable} bg-background text-primary`}>
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
