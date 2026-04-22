"use client";

import Image from "next/image";
import Link from "next/link";
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

// Minimum drag distance (px) before we suppress the click/navigate
const DRAG_THRESHOLD = 5;

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
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const isDragging = useRef(false);

  const handleDragStart = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleDrag = useCallback(() => {
    if (Math.abs(x.get()) > DRAG_THRESHOLD || Math.abs(y.get()) > DRAG_THRESHOLD) {
      isDragging.current = true;
    }
  }, [x, y]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging.current) {
        e.preventDefault();
      }
    },
    [],
  );

  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      dragElastic={0.08}
      dragMomentum={false}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      style={{
        x,
        y,
        transformStyle: "preserve-3d",
        marginLeft: `${isMobile ? item.offsetX * 0.5 : item.offsetX}px`,
        cursor: "grab",
      }}
      initial={{ opacity: 0, y: 40, rotateX: 15, rotateZ: item.rotation * 3 }}
      animate={{ opacity: 1, y: 0, rotateZ: item.rotation }}
      transition={{ duration: 0.7, delay: 0.5 + index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ rotateZ: 0, y: -6, scale: 1.08, transition: { duration: 0.3 } }}
      whileDrag={{
        scale: 1.1,
        rotateZ: 0,
        cursor: "grabbing",
        transition: { duration: 0 },
      }}
    >
      <Link href={item.href} className="block" onClick={handleClick} draggable={false}>
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

export default function Home() {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const navW = isMobile ? NAV_WIDTH_MOBILE : NAV_WIDTH_DESKTOP;
  const navH = Math.round(navW / NAV_ASPECT);

  return (
    <section ref={sectionRef} className="relative h-dvh min-h-screen overflow-hidden">
      {/* Nav — centered, draggable */}
      <div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 md:gap-2"
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
