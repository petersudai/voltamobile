"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { whatsappUrl } from "@/lib/utils";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Menu, X, Phone, Search } from "lucide-react";

const navLinks = [
  { href: "/phones", label: "All Phones" },
  { href: "/phones?brand=apple", label: "iPhone" },
  { href: "/phones?brand=samsung", label: "Samsung" },
  { href: "/phones?brand=google", label: "Pixel" },
  { href: "/phones?condition=EX_UK", label: "Ex-UK" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/phones?search=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
      setMenuOpen(false);
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[#09090c]/95 backdrop-blur-xl border-b border-white/[0.07] shadow-2xl shadow-black/40"
          : "bg-[#09090c]/50 backdrop-blur-md"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Logo size="md" variant="light" />

          {/* Desktop: search expands over nav */}
          {searchOpen ? (
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by brand, model, color, storage…"
                  className="w-full pl-10 pr-10 py-2.5 bg-white/8 border border-white/10 rounded-2xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500/40 focus:bg-white/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => { setSearchOpen(false); setQuery(""); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            <nav className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              aria-label="Search phones"
            >
              <Search className="w-4.5 h-4.5" style={{ width: "18px", height: "18px" }} />
            </button>
            <a
              href={whatsappUrl(WHATSAPP_NUMBER, "Hi! I'd like to know more about your phones.")}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#22c55e] text-white text-sm font-semibold transition-all shadow-lg shadow-green-900/20"
            >
              <Phone className="w-4 h-4" />
              WhatsApp Us
            </a>
            <button
              className="md:hidden p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-950/98 backdrop-blur-xl border-t border-white/5 px-4 pb-5">
          <form onSubmit={handleSearch} className="pt-3 mb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search phones, colors, storage…"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/8 rounded-2xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/30"
              />
            </div>
          </form>
          <nav className="flex flex-col gap-0.5 pt-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={whatsappUrl(WHATSAPP_NUMBER, "Hi! I'd like to know more about your phones.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#25D366] text-white text-sm font-semibold"
            >
              <Phone className="w-4 h-4" />
              WhatsApp Us
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
