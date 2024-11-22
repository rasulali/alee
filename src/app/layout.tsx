import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "aLee",
  description: "Rasul Alee's Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az">
      <body>{children}</body>
    </html>
  );
}
