"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useMotionValue } from "framer-motion";
import { useRef, useCallback } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

const navItems = [
  { label: "Support an Idea", href: "/support", image: "/images/nav/support-an-idea.png", rotation: -2, offsetX: -15 },
  { label: "Pitch an Idea", href: "/propose", image: "/images/nav/pitch-an-idea.png", rotation: 1.5, offsetX: 20 },
  { label: "About Us", href: "/about", image: "/images/nav/about-us.png", rotation: -1, offsetX: -8 },
  { label: "Events", href: "/events", image: "/images/nav/events.png", rotation: 2.5, offsetX: 10 },
  { label: "Media", href: "/media", image: "/images/nav/media.png", rotation: -1.5, offsetX: -18 },
];

// Nav images are 840×227 — rendered smaller on-screen
const NAV_WIDTH_MOBILE = 200;
const NAV_WIDTH_DESKTOP = 280;
const NAV_ASPECT = 840 / 227;

// Minimum drag distance (px) before we consider it a drag (not a tap)
const DRAG_THRESHOLD = 8;

function DraggableNavItem({
  item,
  index,
  navW,
  navH,
  isMobile,
  constraintsRef,
}: {
  item: (typeof navItems)[number];
  index: number;
  navW: number;
  navH: number;
  isMobile: boolean;
  constraintsRef: React.RefObject<HTMLElement | null>;
}) {
  const router = useRouter();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!pointerStart.current) return;
      const dx = Math.abs(e.clientX - pointerStart.current.x);
      const dy = Math.abs(e.clientY - pointerStart.current.y);
      pointerStart.current = null;
      // If pointer barely moved, treat as a tap/click → navigate
      if (dx < DRAG_THRESHOLD && dy < DRAG_THRESHOLD) {
        router.push(item.href);
      }
    },
    [router, item.href],
  );

  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      dragElastic={0.08}
      dragMomentum={false}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      style={{
        x,
        y,
        transformStyle: "preserve-3d",
        marginLeft: `${isMobile ? item.offsetX * 0.5 : item.offsetX}px`,
        cursor: "grab",
        touchAction: "none",
      }}
      initial={{ opacity: 0, y: 20, rotateX: 8, rotateZ: item.rotation * 1.5 }}
      animate={{ opacity: 1, y: 0, rotateZ: item.rotation }}
      transition={{ duration: 0.6, delay: 0.3 + index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ rotateZ: 0, scale: 1.08, transition: { duration: 0.3 } }}
      whileDrag={{
        scale: 1.1,
        rotateZ: 0,
        cursor: "grabbing",
        transition: { duration: 0 },
      }}
    >
      {/* Link for SEO / accessibility — clicks handled by pointerUp above */}
      <Link href={item.href} className="block" draggable={false} tabIndex={-1} onClick={(e) => e.preventDefault()}>
        <Image
          src={item.image}
          alt={item.label}
          width={navW}
          height={navH}
          className="select-none drop-shadow-lg pointer-events-none"
          draggable={false}
        />
      </Link>
    </motion.div>
  );
}

function DraggableLogo({
  isMobile,
  constraintsRef,
  delay,
}: {
  isMobile: boolean;
  constraintsRef: React.RefObject<HTMLElement | null>;
  delay: number;
}) {
  const router = useRouter();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const size = isMobile ? 48 : 64;

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!pointerStart.current) return;
      const dx = Math.abs(e.clientX - pointerStart.current.x);
      const dy = Math.abs(e.clientY - pointerStart.current.y);
      pointerStart.current = null;
      if (dx < DRAG_THRESHOLD && dy < DRAG_THRESHOLD) {
        router.push("/");
      }
    },
    [router],
  );

  return (
    <motion.div
      className="mt-6 md:mt-10"
      drag
      dragConstraints={constraintsRef}
      dragElastic={0.08}
      dragMomentum={false}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      style={{ x, y, cursor: "grab", touchAction: "none" }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      whileHover={{ scale: 1.08, transition: { duration: 0.3 } }}
      whileDrag={{ scale: 1.1, cursor: "grabbing", transition: { duration: 0 } }}
    >
      <Link
        href="/"
        aria-label="Crystallise home"
        className="block"
        draggable={false}
        tabIndex={-1}
        onClick={(e) => e.preventDefault()}
      >
        <Image
          src="/images/logo-stone-face.png"
          alt="Crystallise"
          width={size}
          height={size}
          className="select-none drop-shadow-lg pointer-events-none"
          draggable={false}
          priority
        />
      </Link>
    </motion.div>
  );
}

export default function Home() {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const navW = isMobile ? NAV_WIDTH_MOBILE : NAV_WIDTH_DESKTOP;
  const navH = Math.round(navW / NAV_ASPECT);

  return (
    <section ref={sectionRef} className="relative h-dvh min-h-screen overflow-hidden">
      {/* Nav — centered, draggable */}
      <div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 md:gap-4"
        style={{ perspective: "600px" }}
      >
        {navItems.map((item, i) => (
          <DraggableNavItem
            key={item.href}
            item={item}
            index={i}
            navW={navW}
            navH={navH}
            isMobile={isMobile}
            constraintsRef={sectionRef}
          />
        ))}

        <DraggableLogo
          isMobile={isMobile}
          constraintsRef={sectionRef}
          delay={0.3 + navItems.length * 0.1}
        />
      </div>
    </section>
  );
}
