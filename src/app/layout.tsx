import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from 'next/font/google'
import { ThemeProvider } from "../components/theme-provider";

export const metadata: Metadata = {
  title: "alee - coming soon",
  description: "",
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
    <html lang="en" suppressHydrationWarning className={montserrat.className}>
      <body
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
