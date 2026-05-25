"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface ZoraCVLogoProps {
  /** Size of the icon box in pixels. Wordmark scales proportionally. */
  size?: number;
  /** Show or hide the text wordmark */
  showText?: boolean;
  /** Extra classes for the outer wrapper */
  className?: string;
  /** If false, renders as a plain div instead of a Next.js Link */
  asLink?: boolean;
}

/**
 * ZoraCV premium brand logo.
 * Icon: layered Z-mark with indigo→violet gradient and a subtle document underlay.
 * Wordmark: "Zora" in bold + "CV" in gradient.
 */
export function ZoraCVLogo({
  size = 36,
  showText = true,
  className = "",
  asLink = true,
}: ZoraCVLogoProps) {
  const icon = (
    <motion.div
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      style={{ width: size, height: size }}
      className="relative flex-shrink-0"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="ZoraCV logo icon"
      >
        <defs>
          <linearGradient id="zcv-grad-main" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="zcv-grad-shine" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <filter id="zcv-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#6366f1" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* Outer rounded square */}
        <rect
          x="1" y="1" width="38" height="38"
          rx="11"
          fill="url(#zcv-grad-main)"
          filter="url(#zcv-shadow)"
        />

        {/* Inner shine overlay (top-half gloss) */}
        <rect x="1" y="1" width="38" height="19" rx="11" fill="url(#zcv-grad-shine)" />
        <rect x="1" y="10" width="38" height="10" fill="url(#zcv-grad-shine)" />

        {/* Document underlay — subtle white lines suggesting a résumé page */}
        <rect x="24" y="10" width="9" height="1.8" rx="0.9" fill="white" fillOpacity="0.18" />
        <rect x="24" y="14" width="6" height="1.8" rx="0.9" fill="white" fillOpacity="0.14" />
        <rect x="24" y="18" width="7.5" height="1.8" rx="0.9" fill="white" fillOpacity="0.14" />

        {/* Bold "Z" letterform */}
        {/* Top bar */}
        <rect x="9" y="11" width="16" height="3.2" rx="1.6" fill="white" />
        {/* Diagonal stroke — drawn as a rotated parallelogram path */}
        <path
          d="M23.6 14.2 L12.4 26.8"
          stroke="white"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        {/* Bottom bar */}
        <rect x="9" y="25.8" width="16" height="3.2" rx="1.6" fill="white" />
      </svg>
    </motion.div>
  );

  const wordmark = showText && (
    <div className="flex items-baseline gap-0.5 select-none">
      <span
        style={{ fontSize: size * 0.58, lineHeight: 1 }}
        className="font-extrabold tracking-tight text-slate-900 dark:text-white"
      >
        Zora
      </span>
      <span
        style={{ fontSize: size * 0.58, lineHeight: 1 }}
        className="font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent"
      >
        CV
      </span>
    </div>
  );

  const inner = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {icon}
      {wordmark}
    </div>
  );

  if (!asLink) return inner;

  return (
    <Link href="/" aria-label="ZoraCV — go to homepage">
      {inner}
    </Link>
  );
}
