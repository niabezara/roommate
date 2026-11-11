import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A Little Place for Us | Irinka",
  description: "A tiny interactive world, with one very important question.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
