import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";

const roboto = Roboto_Mono({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NikCode test app",
  description: "Cities list by Dude",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} container`}>{children}</body>
    </html>
  );
}
