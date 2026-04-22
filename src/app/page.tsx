"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";

const navItems = [
  { label: "Support an Idea", href: "/support", image: "/images/nav/support-an-idea.png", rotation: -2, offsetX: -15 },
  { label: "Pitch an Idea", href: "/propose", image: "/images/nav/pitch-an-idea.png", rotation: 1.5, offsetX: 20 },
  { label: "About Us", href: "/about", image: "/images/nav/about-us.png", rotation: -1, offsetX: -8 },
  { label: "Events", href: "/events", image: "/images/nav/events.png", rotation: 2.5, offsetX: 10 },
  { label: "Media", href: "/media", image: "/images/nav/media.png", rotation: -1.5, offsetX: -18 },
];

// Grey backdrop baked into the hero artwork
const HERO_BG_COLOR = "#8a8a8a";

// Nav images are 2619×708 @3x → logical 873×236, rendered smaller on-screen
const NAV_WIDTH_MOBILE = 200;
const NAV_WIDTH_DESKTOP = 280;
const NAV_ASPECT = 2619 / 708; // ≈ 3.7

export default function Home() {
  const isMobile = useIsMobile();
  const navW = isMobile ? NAV_WIDTH_MOBILE : NAV_WIDTH_DESKTOP;
  const navH = Math.round(navW / NAV_ASPECT);

  return (
    <section
      className="relative h-dvh min-h-screen overflow-hidden"
      style={{ backgroundColor: HERO_BG_COLOR }}
    >
      {/* Mobile: portrait artwork */}
      <Image
        src="/images/hero-bg.png"
        alt=""
        fill
        priority
        className="object-cover object-top md:hidden select-none pointer-events-none"
      />
      {/* Desktop: landscape artwork (blank, no baked-in nav) */}
      <Image
        src="/images/hero-bg-desktop.png"
        alt=""
        fill
        priority
        className="hidden md:block object-cover object-center select-none pointer-events-none"
      />

      {/* Nav — centered */}
      <div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 md:gap-2"
        style={{ perspective: "600px" }}
      >
        {navItems.map((item, i) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, y: 40, rotateX: 15, rotateZ: item.rotation * 3 }}
            animate={{ opacity: 1, y: 0, rotateZ: item.rotation }}
            transition={{ duration: 0.7, delay: 0.5 + i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ rotateX: 0, rotateY: 0, rotateZ: 0, y: -6, scale: 1.08, transition: { duration: 0.3 } }}
            style={{ transformStyle: "preserve-3d", marginLeft: `${isMobile ? item.offsetX * 0.5 : item.offsetX}px` }}
          >
            <Link href={item.href} className="block">
              <Image
                src={item.image}
                alt={item.label}
                width={navW}
                height={navH}
                className="select-none drop-shadow-lg"
              />
            </Link>
          </motion.div>
        ))}

        <motion.div
          className="mt-2 md:mt-4"
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
  );
}
