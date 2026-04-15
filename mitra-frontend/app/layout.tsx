import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "M.I.T.R.A. Dashboard",
  description: "Mahindra Innovative Technologies for Agriculture",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}