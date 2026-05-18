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

        {/* ── Map widget ─────────────────────────────────────────────────── */}
        <div className="mt-12 rounded-2xl overflow-hidden border border-gray-800 relative shadow-2xl shadow-black/40">
          {/* Map iframe */}
          <iframe
            title="Volta Mobile — Store Location"
            src="https://maps.google.com/maps?q=Moi+Avenue,+Nairobi+CBD,+Kenya&t=&z=17&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="240"
            style={{ border: 0, display: "block", filter: "grayscale(0.25) contrast(1.05) brightness(0.92)" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* Gradient vignette — blends map into dark footer */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-gray-950/60 to-transparent pointer-events-none" />

          {/* Store info card — overlaid at the bottom */}
          <div className="absolute bottom-3 left-3 right-3 z-10 bg-gray-900/90 backdrop-blur-md rounded-xl border border-white/[0.07] px-4 py-3 flex items-center gap-3">
            {/* Pin icon */}
            <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-blue-600/20 border border-blue-500/20 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-blue-400" />
            </div>

            {/* Address + hours */}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold leading-tight">Volta Mobile</p>
              <p className="text-gray-400 text-xs truncate mt-0.5">{STORE_ADDRESS}</p>
              <p className="text-gray-500 text-[11px] mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3 flex-shrink-0" />
                {STORE_HOURS}
              </p>
            </div>

            {/* Directions CTA */}
            <a
              href="https://maps.google.com/?q=Moi+Avenue,+Nairobi+CBD,+Kenya"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors whitespace-nowrap"
            >
              Get Directions
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 space-y-4 text-xs text-gray-600">
          <p className="text-center text-gray-700 leading-relaxed max-w-2xl mx-auto">
            This is a demo site built to showcase what your phone shop could look like online. All products, prices, and contact details are for illustration purposes only.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} Volta Mobile. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <p>Nairobi CBD, Kenya 🇰🇪</p>
              <span className="hidden sm:block text-gray-800">·</span>
              <div className="flex flex-col items-center sm:items-end gap-0.5">
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
                <p className="text-gray-600">
                  Want a site like this for your shop?{" "}
                  <a
                    href="https://sudaidevfolio.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors duration-200 font-medium"
                  >
                    Let&apos;s talk.
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
