import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from 'next/font/google'

export const metadata: Metadata = {
  title: "alee",
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
    <html lang="en" className={montserrat.className}>
      <body
      >
        {children}
      </body>
    </html>
  );
}
