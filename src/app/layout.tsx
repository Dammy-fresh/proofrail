import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Proofrail",
  description: "Read-only smart-contract intelligence for Robinhood Chain mainnet.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
