"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRef } from "react";
import Footer from "@/components/Footer";
import StickyNote from "@/components/StickyNote";
import PolaroidCard from "@/components/PolaroidCard";
import CrystalItem from "@/components/CrystalItem";
import { useIsMobile } from "@/hooks/useIsMobile";

const navItems = [
  { label: "Support an Idea", href: "/support", rotation: -2, offsetX: -15 },
  { label: "Pitch an Idea", href: "/propose", rotation: 1.5, offsetX: 20 },
  { label: "About Us", href: "/about", rotation: -1, offsetX: -8 },
  { label: "Events", href: "/events", rotation: 2.5, offsetX: 10 },
  { label: "Media", href: "/media", rotation: -1.5, offsetX: -18 },
];

// Desktop notes — all 15
const desktopNotes = [
  { w: 140, h: 120, cx: -480, cy: -200, rot: -5, color: "#FFD1E3", text: "ideas" },
  { w: 130, h: 130, cx: -500, cy: -50, rot: 8, color: "#FFF8A6", text: "climb\nmore" },
  { w: 135, h: 115, cx: -460, cy: 80, rot: -3, color: "#D4E8E0", text: "explore" },
  { w: 130, h: 110, cx: -280, cy: -250, rot: 4, color: "#FFEAA7", text: "inspire" },
  { w: 125, h: 115, cx: -300, cy: 60, rot: -8, color: "#FCE4EC", text: "express" },
  { w: 140, h: 120, cx: 240, cy: -240, rot: -4, color: "#CDE7FF", text: "create" },
  { w: 130, h: 115, cx: 260, cy: 50, rot: 6, color: "#E6D7FF", text: "art" },
  { w: 135, h: 125, cx: 440, cy: -180, rot: 5, color: "#FFE8CC", text: "film" },
  { w: 130, h: 120, cx: 460, cy: -30, rot: -7, color: "#C4FAF8", text: "connect" },
  { w: 125, h: 110, cx: 420, cy: 90, rot: 10, color: "#FFF9C4", text: "imagine" },
  { w: 135, h: 115, cx: -80, cy: -290, rot: 6, color: "#D7F5C9", text: "tell\nstories" },
  { w: 130, h: 110, cx: 80, cy: -280, rot: -5, color: "#F5D6D6", text: "dream" },
  { w: 125, h: 105, cx: -200, cy: -300, rot: -3, color: "#FFE0B2", text: "wonder" },
  { w: 130, h: 110, cx: -450, cy: 200, rot: -6, color: "#D6E5F5", text: "share" },
  { w: 125, h: 105, cx: 450, cy: 190, rot: 5, color: "#E8F5E9", text: "climb\nhigh" },
];

// Mobile notes — just 4, smaller, tighter offsets
const mobileNotes = [
  { w: 90, h: 75, cx: -120, cy: -200, rot: -8, color: "#FFD1E3", text: "ideas" },
  { w: 85, h: 80, cx: 100, cy: -190, rot: 10, color: "#FFF8A6", text: "climb\nmore" },
  { w: 90, h: 75, cx: -130, cy: 180, rot: 5, color: "#D7F5C9", text: "create" },
  { w: 85, h: 75, cx: 110, cy: 190, rot: -6, color: "#E6D7FF", text: "dream" },
];

const desktopPolaroids = [
  { src: "/images/lynn-hill-great-roof.jpg", alt: "Lynn Hill on the Great Roof", caption: "The Great Roof", cx: -350, cy: -100, rot: -5 },
  { src: "/images/lynn-hill-kgf-14-2016-the-nose.jpg", alt: "Lynn Hill on The Nose", caption: "The Nose, 1993", cx: 330, cy: -80, rot: 7 },
  { src: "/images/hamish-megatron.jpg", alt: "Hamish on Megatron", caption: "Megatron", cx: -60, cy: 200, rot: -3 },
];

const mobilePolaroids = [
  { src: "/images/hamish-megatron.jpg", alt: "Hamish on Megatron", caption: "Megatron", cx: -100, cy: -50, rot: -5 },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const notes = isMobile ? mobileNotes : desktopNotes;
  const polaroids = isMobile ? mobilePolaroids : desktopPolaroids;

  return (
    <div className="min-h-screen flex flex-col">
      <section ref={heroRef} className="relative h-dvh overflow-hidden bg-[#fdfbf7]">
        {/* Graph Paper Grid Background */}
        <div
          className="absolute inset-0 z-0 opacity-40 mix-blend-multiply"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(120, 140, 200, 0.4) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(120, 140, 200, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            backgroundPosition: "center top",
          }}
        />

        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 z-[1] pointer-events-none opacity-50 mix-blend-multiply bg-[url('/images/paper-texture.png')] bg-repeat" />

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
        </div>

        {/* Sticky notes */}
        {notes.map((note, i) => (
          <StickyNote key={`${isMobile ? "m" : "d"}-${i}`} index={isMobile ? i + 100 : i} constraintsRef={heroRef} {...note} />
        ))}

        {/* Polaroid cards */}
        {polaroids.map((p, i) => (
          <PolaroidCard key={`polaroid-${isMobile ? "m" : "d"}-${i}`} index={isMobile ? i + 100 : i} constraintsRef={heroRef} small={isMobile} {...p} />
        ))}

        {/* Crystal */}
        <CrystalItem
          index={0}
          src="/images/crystal.png"
          label="for Dave"
          cx={isMobile ? 80 : 160}
          cy={isMobile ? 160 : 220}
          rot={4}
          size={isMobile ? 80 : 120}
          constraintsRef={heroRef}
        />

        {/* Logo — bottom center */}
        <motion.div
          className="absolute z-10"
          style={{ bottom: "24px", left: "50%", x: "-50%" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <Image
            src="/images/crystallise-logo.png"
            alt="Crystallise"
            width={isMobile ? 120 : 160}
            height={isMobile ? 36 : 48}
            className="opacity-90"
            priority
          />
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
