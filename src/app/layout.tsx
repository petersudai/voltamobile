import type { Metadata } from "next";
import { Archivo, Public_Sans } from "next/font/google";
import "./globals.css";

const archivo = Archivo({ subsets: ["latin"], variable: "--font-display", weight: ["600", "700", "800"] });
const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: {
    default: "Volta Mobile | Ex-UK and new phones on Moi Avenue, Nairobi",
    template: "%s | Volta Mobile",
  },
  description:
    "Ex-UK, brand new and refurbished iPhone, Samsung Galaxy and Google Pixel phones on Moi Avenue, Nairobi CBD. Every listing shows the real battery health.",
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

// Light is the default; dark applies only if the visitor chose it with the toggle.
const THEME_SCRIPT = `(function(){try{if(localStorage.getItem("theme")==="dark")document.documentElement.classList.add("dark")}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${publicSans.variable} h-full`} suppressHydrationWarning>
      <head>
        {/* Sets the theme before first paint so there is no light/dark flash. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-full antialiased font-sans">{children}</body>
    </html>
  );
}
