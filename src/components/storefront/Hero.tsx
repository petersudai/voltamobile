"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Star, Zap } from "lucide-react";
import { whatsappUrl } from "@/lib/utils";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { formatKES } from "@/lib/format";
import type { Product } from "@/types";

const stats = [
  { value: "250+", label: "Phones Sold" },
  { value: "4.8★", label: "Customer Rating" },
  { value: "3hrs", label: "Avg. Delivery" },
];

interface HeroProps {
  /** Phone image URL — from the hero product, or the Settings upload, or the default. */
  heroImageUrl: string;
  /** If a product is marked isHero, its real data populates the floating badges. */
  heroProduct: Product | null;
}

export function Hero({ heroImageUrl, heroProduct }: HeroProps) {
  // Floating badge data — real product info when available, sensible defaults otherwise
  const priceBadge = heroProduct
    ? {
        label: `${heroProduct.brand.name} ${heroProduct.modelName} · ${heroProduct.condition.replace("_", "-")}`,
        price: formatKES(heroProduct.priceKES),
        link: `/phones/${heroProduct.slug}`,
      }
    : {
        label: "iPhone 15 Pro · Ex-UK",
        price: "KSh 89,999",
        link: "/phones",
      };

  const batteryPct = heroProduct?.batteryHealth;

  return (
    <>
      <section className="relative min-h-screen bg-gray-950 flex items-center overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl" />
        </div>

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* ── Left column ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                <MapPin className="w-3.5 h-3.5" />
                Nairobi CBD · Moi Avenue
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-black text-white leading-[1.02] tracking-tight">
                Premium{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                  Phones.
                </span>
                <br />
                Honest{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                  Prices.
                </span>
              </h1>

              <p className="mt-6 text-lg text-gray-300 leading-relaxed max-w-md">
                Nairobi&apos;s most trusted source for Ex-UK, Brand New &amp; Refurbished
                smartphones. Every device battery-tested and verified.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/phones"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base transition-all duration-150 shadow-lg shadow-blue-500/25"
                >
                  Browse Phones
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={whatsappUrl(WHATSAPP_NUMBER, "Hi, I saw the Volta Mobile demo site and I'd like to discuss building something similar for my shop.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-base transition-all"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  WhatsApp Stock
                </a>
              </div>

              <div className="mt-10 flex items-center gap-5 sm:gap-8">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-xl sm:text-2xl font-black text-white">{stat.value}</p>
                    <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Right column — phone image ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-52 sm:w-64 lg:w-72">
              {/* Glow ring */}
              <div className="absolute inset-0 bg-blue-500/20 rounded-[40px] blur-2xl scale-110" />

              {/* Phone frame */}
              <div className="relative rounded-[32px] overflow-hidden shadow-2xl border border-white/10 bg-[#0a0a0f] aspect-[9/19]">
                <Image
                  src={heroImageUrl}
                  alt={heroProduct ? heroProduct.name : "Premium smartphone"}
                  fill
                  sizes="(max-width: 640px) 256px, 288px"
                  className="object-contain"
                  priority
                />
              </div>

              {/* Floating battery badge — shows real health if available */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute -right-4 sm:-right-8 lg:-right-10 top-14 bg-white rounded-2xl shadow-xl px-3 py-2.5 sm:px-4 sm:py-3 flex items-center gap-2.5 border border-gray-100"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-base sm:text-lg">🔋</span>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500">Battery Health</p>
                  <p className="text-xs sm:text-sm font-bold text-emerald-600">
                    {batteryPct ? `${batteryPct}% Excellent` : "Certified"}
                  </p>
                </div>
              </motion.div>

              {/* Floating price badge — real product data when available */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.75 }}
                className="absolute -left-4 sm:-left-8 lg:-left-10 bottom-20 sm:bottom-24 bg-white rounded-2xl shadow-xl px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-100 max-w-[145px] sm:max-w-[170px]"
              >
                <p className="text-xs text-gray-500 line-clamp-1">{priceBadge.label}</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{priceBadge.price}</p>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {heroProduct && (
                    <Link
                      href={priceBadge.link}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[10px] font-bold text-blue-600 hover:underline whitespace-nowrap"
                    >
                      View →
                    </Link>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Scrolling ticker */}
      <div className="bg-gray-950 border-y border-white/5 py-3.5 overflow-hidden">
        <div className="flex animate-marquee gap-0 whitespace-nowrap">
          {[...Array(2)].map((_, pass) => (
            <div key={pass} className="flex items-center gap-0 flex-shrink-0">
              {[
                "iPhone 15 Pro",
                "Samsung S24 Ultra",
                "Google Pixel 8 Pro",
                "Ex-UK Imports",
                "Brand New Sealed",
                "Refurbished Grade A",
                "Nairobi CBD",
                "Same-Day Delivery",
                "Battery Certified",
              ].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-[0.2em]"
                >
                  {item}
                  <span className="text-blue-700">⚡</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
