import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dines Voucher Generator",
  description: "Generate beautiful vouchers with QR codes from your spreadsheet data",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, overflow: "hidden" }}>{children}</body>
    </html>
  );
}
