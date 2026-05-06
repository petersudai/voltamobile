import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: {
    default: "Volta Mobile — Premium Phones in Nairobi CBD",
    template: "%s | Volta Mobile",
  },
  description:
    "Nairobi's most trusted source for Ex-UK, Brand New & Refurbished smartphones. iPhone, Samsung Galaxy & Google Pixel — battery health certified.",
  keywords: [
    "iPhone Nairobi",
    "Ex-UK phones Kenya",
    "Samsung Galaxy Nairobi",
    "buy phone Nairobi CBD",
    "refurbished phones Kenya",
    "iPhone 15 Pro Nairobi",
  ],
  openGraph: {
    siteName: "Volta Mobile",
    locale: "en_KE",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full antialiased font-sans">{children}</body>
    </html>
  );
}
