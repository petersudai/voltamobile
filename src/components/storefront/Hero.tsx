import Link from "next/link";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { whatsappUrl } from "@/lib/utils";
import { WHATSAPP_NUMBER, CONDITION_LABELS } from "@/lib/constants";
import { HeroStage, type HeroSlip } from "./HeroStage";
import type { Product } from "@/types";

const stats = [
  { value: "250+", label: "Phones sold" },
  { value: "4.8★", label: "Customer rating" },
  { value: "3hrs", label: "Average delivery" },
];

interface HeroProps {
  /** Phone image URL: from the hero product, or the Settings upload, or the default. */
  heroImageUrl: string;
  /** If a product is marked isHero, its real data fills the floating cards. */
  heroProduct: Product | null;
}

export function Hero({ heroImageUrl, heroProduct }: HeroProps) {
  const slip: HeroSlip = heroProduct
    ? {
        name: heroProduct.modelName,
        condition: CONDITION_LABELS[heroProduct.condition] ?? heroProduct.condition,
        battery: heroProduct.batteryHealth ?? null,
        spec: `${heroProduct.storageCapacity}, ${heroProduct.color}`,
        price: heroProduct.priceKES,
        market:
          heroProduct.marketPriceKES && heroProduct.marketPriceKES > heroProduct.priceKES
            ? heroProduct.marketPriceKES
            : null,
        href: `/phones/${heroProduct.slug}`,
        cta: "View this phone",
      }
    : {
        name: "iPhone 15 Pro",
        condition: "Ex-UK",
        battery: 91,
        spec: "256GB, Natural Titanium",
        price: 89999,
        market: 109999,
        href: "/phones",
        cta: "See all phones",
      };

  return (
    <section className="relative overflow-hidden bg-[#07070b] border-b border-white/[0.06] pt-28 pb-16 sm:pt-32 sm:pb-24 lg:pt-36 lg:pb-28">
      {/* Atmosphere: colour washes + fading grid */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-40 right-[-10%] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.35),transparent_65%)]" />
        <div className="absolute bottom-[-220px] left-[-10%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.14),transparent_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_70%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-10 items-center">
        {/* Left */}
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-1.5 text-xs sm:text-sm font-medium text-gray-200">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <MapPin className="h-3.5 w-3.5 text-gray-400" />
            Moi Avenue, Nairobi CBD
          </p>

          <h1 className="mt-6 text-[2.6rem] sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.02]">
            Premium phones.
            <span className="block text-balance bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              Honest battery health.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-gray-300 leading-relaxed max-w-lg">
            Ex-UK, brand new and refurbished iPhone, Samsung and Pixel in the heart of
            Nairobi CBD. The real battery percentage is on every listing, and you can
            inspect the phone in the shop before you pay.
          </p>

          <div className="mt-7 sm:mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/phones"
              className="group inline-flex items-center gap-2 px-5 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-base shadow-[0_10px_40px_-8px_rgba(37,99,235,0.8)] transition-all"
            >
              Browse phones
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href={whatsappUrl(
                WHATSAPP_NUMBER,
                "Hi, I saw the Volta Mobile demo site and I'd like to discuss building something similar for my shop."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl border border-white/15 bg-white/[0.05] hover:bg-white/[0.1] text-white font-semibold text-base transition-colors"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              WhatsApp us
            </a>
          </div>

          <dl className="mt-8 sm:mt-11 grid grid-cols-3 gap-2.5 sm:gap-3 max-w-md">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] px-3.5 py-3"
              >
                <dd className="text-xl sm:text-2xl font-extrabold text-white tabular">{stat.value}</dd>
                <dt className="mt-0.5 text-xs text-gray-400">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        {/* Right: battery ring stage */}
        <HeroStage imageUrl={heroImageUrl} slip={slip} />
      </div>
    </section>
  );
}
