import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voucher Generator",
  description: "Upload your data and generate beautiful vouchers as images or PDFs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
