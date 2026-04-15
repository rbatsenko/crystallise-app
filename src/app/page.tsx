"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { useIsMobile } from "@/hooks/useIsMobile";

const navItems = [
  { label: "Support an Idea", href: "/support", rotation: -2, offsetX: -15 },
  { label: "Pitch an Idea", href: "/propose", rotation: 1.5, offsetX: 20 },
  { label: "About Us", href: "/about", rotation: -1, offsetX: -8 },
  { label: "Events", href: "/events", rotation: 2.5, offsetX: 10 },
  { label: "Media", href: "/media", rotation: -1.5, offsetX: -18 },
];

// Grey backdrop baked into hero-bg.png — used to fill letterbox areas on desktop
const HERO_BG_COLOR = "#8a8a8a";

export default function Home() {
  const isMobile = useIsMobile();

  return (
    <div
      className="relative min-h-dvh flex flex-col overflow-hidden"
      style={{ backgroundColor: HERO_BG_COLOR }}
    >
      {/* Mobile: full-width image pinned to top at natural aspect — extends below
          the first viewport so scrolling reveals the climber + CRYSTALLISE wordmark */}
      <div className="md:hidden absolute top-0 left-1/2 -translate-x-1/2 w-[115%] pointer-events-none select-none z-0">
        <Image
          src="/images/hero-bg.png"
          alt=""
          width={1500}
          height={3248}
          className="w-full h-auto"
          priority
        />
      </div>

      {/* Desktop: letterboxed contain so the full composition stays visible */}
      <div className="hidden md:block fixed inset-0 pointer-events-none select-none z-0">
        <Image
          src="/images/hero-bg.png"
          alt=""
          fill
          className="object-contain object-center"
          priority
        />
      </div>

      {/* Hero — nav centered in first viewport */}
      <section className="relative z-10 h-dvh flex items-center justify-center">
        <div
          className="flex flex-col items-center gap-3 md:gap-4"
          style={{ perspective: "600px" }}
        >
          {navItems.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 40, rotateX: 15, rotateZ: item.rotation * 3 }}
              animate={{ opacity: 1, y: 0, rotateZ: item.rotation }}
              transition={{ duration: 0.7, delay: 0.5 + i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ rotateX: 0, rotateY: 0, rotateZ: 0, y: -6, scale: 1.05, transition: { duration: 0.3 } }}
              style={{ transformStyle: "preserve-3d", marginLeft: `${isMobile ? item.offsetX * 0.5 : item.offsetX}px` }}
            >
              <Link
                href={item.href}
                className="block px-6 py-2 md:px-8 md:py-3 text-center font-mono font-bold text-lg md:text-2xl tracking-[0.15em] text-[#f4f4f4] uppercase bg-[#1a1a1a]"
                style={{
                  boxShadow: "2px 4px 8px rgba(0,0,0,0.4), inset 1px 1px 2px rgba(255,255,255,0.2)",
                  textShadow: "-1px -1px 0 rgba(255,255,255,0.4), 1px 1px 2px rgba(0,0,0,0.8)",
                  borderRadius: "2px",
                }}
              >
                {item.label}
              </Link>
            </motion.div>
          ))}

          <motion.div
            className="mt-4 md:mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 + navItems.length * 0.12 }}
          >
            <Image
              src="/images/logo-stone-face.png"
              alt="Crystallise"
              width={isMobile ? 48 : 64}
              height={isMobile ? 48 : 64}
              className="select-none"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* Spacer on mobile so the rest of the background image (climber + wordmark)
          is scroll-revealed before the footer. Uses the image's natural aspect
          (1500/3248 ≈ 0.462) minus one viewport. */}
      <div
        className="md:hidden relative z-10"
        style={{ height: "calc(100vw * 1.15 * 3248 / 1500 - 100dvh)" }}
      />

      <div className="relative z-10">
        <Footer transparent />
      </div>
    </div>
  );
}
