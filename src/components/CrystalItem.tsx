"use client";

import { motion, useMotionValue } from "framer-motion";
import { memo, useRef, useCallback } from "react";
import Image from "next/image";

interface CrystalItemProps {
  index: number;
  src: string;
  label: string;
  cx: number;
  cy: number;
  rot: number;
  size?: number;
  constraintsRef: React.RefObject<HTMLElement | null>;
}

let crystalZ = 12;

function CrystalItem({
  index,
  src,
  label,
  cx,
  cy,
  rot,
  size = 120,
  constraintsRef,
}: CrystalItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const bringToFront = useCallback(() => {
    if (ref.current) {
      crystalZ += 1;
      ref.current.style.zIndex = String(crystalZ);
    }
  }, []);

  return (
    <motion.div
      ref={ref}
      className="absolute select-none cursor-grab active:cursor-grabbing"
      drag
      dragConstraints={constraintsRef}
      dragElastic={0.05}
      dragMomentum={false}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
      onDragStart={bringToFront}
      onPointerDown={bringToFront}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      whileDrag={{
        scale: 1.05,
        transition: { duration: 0 },
      }}
      transition={{
        duration: 0.5,
        delay: 0.6,
        ease: "easeOut",
      }}
      style={{
        x,
        y,
        left: `calc(50% + ${cx}px - ${size / 2}px)`,
        top: `calc(50% + ${cy}px - ${size / 2}px)`,
        rotate: `${rot}deg`,
        zIndex: 12,
        willChange: "transform",
      }}
    >
      {/* Crystal image with drop shadow */}
      <div
        className="relative"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          filter: "drop-shadow(4px 8px 12px rgba(0,0,0,0.25))",
        }}
      >
        <Image
          src={src}
          alt={label}
          fill
          className="object-contain"
          sizes={`${size}px`}
          draggable={false}
        />
      </div>

      {/* Small paper label */}
      <div
        className="mx-auto -mt-3 px-3 py-1 bg-white/80 font-[family-name:var(--font-handwritten)] text-sm text-charcoal/70 text-center whitespace-nowrap"
        style={{
          width: "fit-content",
          boxShadow: "1px 2px 4px rgba(0,0,0,0.08)",
          transform: `rotate(${-rot + 2}deg)`,
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}

export default memo(CrystalItem);
