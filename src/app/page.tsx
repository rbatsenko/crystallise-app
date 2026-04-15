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

// Matches the grey backdrop baked into hero-bg.png so letterbox blends on desktop
const HERO_BG_COLOR = "#8a8a8a";

export default function Home() {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col">
      <section
        className="relative h-dvh overflow-hidden"
        style={{ backgroundColor: HERO_BG_COLOR }}
      >
        {/* Hero background artwork — letterboxed (object-contain) so the full
            composition (crystals, climber, rock, CRYSTALLISE wordmark) stays visible */}
        <Image
          src="/images/hero-bg.png"
          alt=""
          fill
          priority
          className="object-cover md:object-contain object-center select-none pointer-events-none"
        />

        {/* Nav — dead center */}
        <div
          className="absolute z-10 flex flex-col items-center gap-3 md:gap-4"
          style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", perspective: "600px" }}
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

          {/* Small stone-face mark beneath the nav */}
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

      <Footer />
    </div>
  );
}
