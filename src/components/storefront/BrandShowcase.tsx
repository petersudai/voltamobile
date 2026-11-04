import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

// ─── Official brand SVG logos ─────────────────────────────────────────────────

function AppleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-label="Apple">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.3.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function SamsungLogo({ className }: { className?: string }) {
  // Wide viewBox with generous right-padding so no letter is clipped.
  // overflow="visible" is a safety net for browsers that miscalculate text width.
  return (
    <svg
      className={className}
      viewBox="0 0 290 46"
      fill="currentColor"
      overflow="visible"
      aria-label="Samsung"
    >
      <text
        x="2"
        y="36"
        fontFamily="'Arial Black', 'Arial', sans-serif"
        fontWeight="900"
        fontSize="34"
        letterSpacing="4"
      >
        SAMSUNG
      </text>
    </svg>
  );
}

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-label="Google">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.255h5.92a5.06 5.06 0 0 1-2.196 3.308v2.751h3.555C21.338 18.48 22.56 15.617 22.56 12.25z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.463-.982 7.284-2.662l-3.555-2.751c-.986.662-2.247 1.054-3.729 1.054-2.868 0-5.296-1.937-6.163-4.543H2.18v2.84C3.995 20.533 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.837 14.098A7.168 7.168 0 0 1 5.463 12c0-.728.126-1.437.374-2.098V7.062H2.18A11.007 11.007 0 0 0 1 12c0 1.778.426 3.46 1.18 4.938l3.657-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.359c1.617 0 3.07.556 4.213 1.647l3.156-3.156C17.457 2.094 14.964 1 12 1 7.7 1 3.995 3.467 2.18 7.062l3.657 2.84C6.704 7.296 9.132 5.36 12 5.36z"
        fill="#EA4335"
      />
    </svg>
  );
}

// ─── Brand data ───────────────────────────────────────────────────────────────

const brands = [
  {
    name: "iPhone",
    slug: "apple",
    Logo: AppleLogo,
    logoClass: "w-10 h-10 text-white drop-shadow-lg",
    description: "iPhone X through 15 Pro Max. Ex-UK, Brand New & Used.",
    bgImage:
      "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=600&q=80&auto=format&fit=crop",
    gradient: "from-black/80 via-black/50 to-black/20",
    cardBg: "bg-gray-900",
    glow: "rgba(148,163,184,0.45)",
    browseLabel: "Browse iPhones",
  },
  {
    name: "Samsung",
    slug: "samsung",
    Logo: SamsungLogo,
    // Fixed width keeps the wordmark at a predictable size so it never clips
    logoClass: "h-7 w-48 text-white drop-shadow-lg",
    description: "Galaxy S10 through S24 Ultra. Fold & Flip series included.",
    bgImage:
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80&auto=format&fit=crop",
    gradient: "from-blue-950/80 via-blue-950/50 to-blue-950/20",
    cardBg: "bg-blue-950",
    glow: "rgba(59,130,246,0.6)",
    browseLabel: "Browse Samsung",
  },
  {
    name: "Google Pixel",
    slug: "google",
    Logo: GoogleLogo,
    logoClass: "w-10 h-10 drop-shadow-lg",
    description: "Pixel 6 through Pixel 8 Pro. Pure Android experience.",
    bgImage:
      "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=600&q=80&auto=format&fit=crop",
    gradient: "from-emerald-950/80 via-emerald-950/50 to-emerald-950/20",
    cardBg: "bg-emerald-950",
    glow: "rgba(52,211,153,0.5)",
    browseLabel: "Browse Pixels",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function BrandShowcase() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24 bg-[#0a0a0f] border-t border-white/5">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(37,99,235,0.16),transparent_65%)]" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            <span className="bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              iPhone
            </span>
            , Samsung and Pixel
          </h2>
          <p className="mt-3 text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
            Imported from the UK and checked in the shop before it is listed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {brands.map(({ name, slug, Logo, logoClass, description, bgImage, gradient, cardBg, glow, browseLabel }) => (
            <Link
              key={slug}
              href={`/phones?brand=${slug}`}
              style={{ ["--glow" as string]: glow }}
              className={`group relative rounded-3xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_70px_-24px_var(--glow)] ${cardBg} min-h-[300px] flex flex-col justify-end`}
            >
              {/* Background phone image */}
              <div className="absolute inset-0">
                <Image
                  src={bgImage}
                  alt={`${name} device`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover opacity-40 group-hover:opacity-55 group-hover:scale-[1.04] transition-all duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${gradient}`} />
                <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,var(--glow),transparent_65%)] opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Content */}
              <div className="relative p-7">
                <div className="mb-4">
                  <Logo className={logoClass} />
                </div>

                <p className="text-sm sm:text-base text-white/75 leading-relaxed">{description}</p>

                <div className="mt-5 inline-flex items-center gap-2 py-1.5 text-white text-sm font-semibold group-hover:gap-3 transition-all">
                  {browseLabel}
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
