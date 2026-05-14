import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { MapPin, Clock, Phone } from "lucide-react";
import { STORE_ADDRESS, STORE_HOURS, WHATSAPP_NUMBER } from "@/lib/constants";
import { whatsappUrl } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10">
          <div className="col-span-2 md:col-span-1">
            <Logo size="md" variant="light" />
            <p className="mt-4 text-sm leading-relaxed text-gray-500">
              Nairobi&apos;s most trusted source for premium smartphones. Ex-UK, Brand New, Refurbished &amp; Used — all battery-tested and verified.
            </p>
            <a
              href={whatsappUrl(WHATSAPP_NUMBER, "Hi! I'd like to enquire about your phones.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-semibold transition-colors"
            >
              <Phone className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Browse</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "/phones", label: "All Phones" },
                { href: "/phones?brand=apple", label: "iPhone" },
                { href: "/phones?brand=samsung", label: "Samsung" },
                { href: "/phones?brand=google", label: "Google Pixel" },
                { href: "/phones?condition=EX_UK", label: "Ex-UK Phones" },
                { href: "/phones?condition=BRAND_NEW", label: "Brand New" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Store</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                <span>{STORE_ADDRESS}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 flex-shrink-0 text-blue-500" />
                <span>{STORE_HOURS}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 flex-shrink-0 text-blue-500" />
                <span>{WHATSAPP_NUMBER}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Why Volta</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                "Battery Health Certified",
                "Genuine Ex-UK Imports",
                "Same-Day Delivery",
                "Physical Store",
                "Price Match Promise",
                "After-Sales Support",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} Volta Mobile. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <p>Nairobi CBD, Kenya 🇰🇪</p>
            <span className="hidden sm:block text-gray-800">·</span>
            <p>
              Built by{" "}
              <a
                href="https://sudaidevfolio.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200 font-medium"
              >
                Peter Sudai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
