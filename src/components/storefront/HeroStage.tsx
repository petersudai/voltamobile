"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { animate, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BadgeCheck, BatteryCharging, Zap } from "lucide-react";
import { formatKES } from "@/lib/format";

export interface HeroSlip {
  name: string;
  condition: string;
  battery: number | null;
  spec: string;
  price: number;
  market: number | null;
  href: string;
  cta: string;
}

const TICKS = Array.from({ length: 72 }, (_, i) => i);

export function HeroStage({ imageUrl, slip }: { imageUrl: string; slip: HeroSlip }) {
  const reduce = useReducedMotion();
  const level = slip.battery ?? 100;
  const [shown, setShown] = useState(reduce ? level : 0);

  useEffect(() => {
    if (reduce) {
      setShown(level);
      return;
    }
    const controls = animate(0, level, {
      duration: 1.8,
      delay: 0.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [level, reduce]);

  const float = (delay: number, dist = 8) =>
    reduce
      ? {}
      : {
          animate: { y: [0, -dist, 0] },
          transition: { duration: 5 + delay, repeat: Infinity, ease: "easeInOut" as const, delay },
        };

  return (
    <div className="relative mx-auto w-full max-w-[460px] lg:max-w-[540px] aspect-square">
      {/* Glow behind the ring */}
      <div className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.55)_0%,rgba(37,99,235,0.18)_45%,transparent_70%)] blur-2xl" />
      <div className="absolute -bottom-2 -left-2 h-1/2 w-1/2 rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.28)_0%,transparent_65%)] blur-2xl" />

      {/* Rotating tick dial */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full animate-[spin_120s_linear_infinite] motion-reduce:animate-none"
        aria-hidden
      >
        {TICKS.map((i) => (
          <line
            key={i}
            x1="50"
            y1="1.5"
            x2="50"
            y2={i % 6 === 0 ? "5" : "3.4"}
            stroke="white"
            strokeOpacity={i % 6 === 0 ? 0.5 : 0.2}
            strokeWidth={i % 6 === 0 ? 0.45 : 0.3}
            transform={`rotate(${i * 5} 50 50)`}
          />
        ))}
      </svg>

      {/* Battery-health ring */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="vm-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FACC15" />
            <stop offset="55%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
        <g transform="rotate(-90 50 50)">
          <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeOpacity="0.08" strokeWidth="2.6" />
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="url(#vm-ring)"
            strokeWidth="2.6"
            strokeLinecap="round"
            initial={{ pathLength: reduce ? level / 100 : 0 }}
            animate={{ pathLength: level / 100 }}
            transition={{ duration: 1.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ filter: "drop-shadow(0 0 2.5px rgba(52,211,153,0.7))" }}
          />
        </g>
      </svg>

      {/* Phone platter */}
      <div className="absolute inset-[16%] rounded-full overflow-hidden bg-[radial-gradient(circle_at_50%_35%,#f4f6fb_0%,#cfd5e2_100%)] ring-1 ring-white/20 shadow-[0_30px_80px_-20px_rgba(37,99,235,0.6)]">
        <Image
          src={imageUrl}
          alt={slip.name}
          fill
          sizes="(max-width: 1024px) 70vw, 380px"
          className="object-contain p-[9%]"
          priority
        />
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_50%)] pointer-events-none" />
      </div>

      {/* Big readout */}
      <motion.div
        {...float(0, 6)}
        className="absolute left-1/2 top-[2%] -translate-x-1/2 flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-[#07110d]/90 px-3.5 py-1.5 shadow-[0_0_30px_-4px_rgba(52,211,153,0.5)]"
      >
        <BatteryCharging className="h-4 w-4 text-emerald-400" />
        <span className="text-sm font-extrabold text-emerald-300 tabular">
          {slip.battery ? `${shown}%` : "New"}
        </span>
        <span className="text-xs text-gray-300">{slip.battery ? "battery health" : "sealed battery"}</span>
      </motion.div>

      {/* Device chip */}
      <motion.div
        {...float(0.8)}
        className="absolute left-0 top-[34%] max-w-[46%] rounded-2xl border border-white/15 bg-[#0c0d14]/90 px-3.5 py-3 shadow-xl shadow-black/50 backdrop-blur-md"
      >
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-cyan-300">
          <BadgeCheck className="h-3.5 w-3.5" />
          {slip.condition}
        </p>
        <p className="mt-1 text-sm font-bold leading-tight text-white">{slip.name}</p>
        <p className="mt-0.5 text-xs text-gray-400">{slip.spec}</p>
      </motion.div>

      {/* Price chip */}
      <motion.div
        {...float(1.6, 10)}
        className="absolute bottom-[3%] right-0 rounded-2xl border border-amber-300/30 bg-[#0c0d14]/90 p-3.5 shadow-xl shadow-black/50 backdrop-blur-md"
      >
        {slip.market && (
          <p className="text-xs text-gray-400 line-through tabular">{formatKES(slip.market)}</p>
        )}
        <p className="text-xl sm:text-2xl font-extrabold leading-tight text-amber-400 tabular">
          {formatKES(slip.price)}
        </p>
        <Link
          href={slip.href}
          className="mt-1.5 inline-flex items-center gap-1 py-1.5 text-xs font-semibold text-gray-200 hover:text-white"
        >
          {slip.cta}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </motion.div>

      {/* Spark */}
      <motion.div
        {...float(0.3, 5)}
        className="absolute right-[4%] top-[18%] flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-300/30 bg-amber-400/15 backdrop-blur-sm"
      >
        <Zap className="h-5 w-5 fill-amber-400 text-amber-400" />
      </motion.div>
    </div>
  );
}
