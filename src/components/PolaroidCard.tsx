"use client";

import { motion, useMotionValue } from "framer-motion";
import { memo, useRef, useCallback, useState, useEffect } from "react";
import Image from "next/image";

interface PolaroidCardProps {
  index: number;
  src: string;
  alt: string;
  caption: string;
  cx: number;
  cy: number;
  rot: number;
  small?: boolean;
  constraintsRef: React.RefObject<HTMLElement | null>;
}

let polaroidZ = 8;

function getStoredPolaroid(index: number) {
  try {
    const raw = localStorage.getItem(`polaroid-${index}`);
    if (raw) return JSON.parse(raw) as { x: number; y: number; caption: string };
  } catch {}
  return null;
}

function storePolaroid(index: number, data: { x: number; y: number; caption: string }) {
  try {
    localStorage.setItem(`polaroid-${index}`, JSON.stringify(data));
  } catch {}
}

function PolaroidCard({
  index,
  src,
  alt,
  caption: defaultCaption,
  cx,
  cy,
  rot,
  small = false,
  constraintsRef,
}: PolaroidCardProps) {
  const [editing, setEditing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const storedRef = useRef(getStoredPolaroid(index));

  const x = useMotionValue(storedRef.current?.x ?? 0);
  const y = useMotionValue(storedRef.current?.y ?? 0);

  const frameW = small ? 140 : 210;
  const centerOffsetX = frameW / 2;
  const centerOffsetY = small ? 90 : 130;

  const bringToFront = useCallback(() => {
    if (cardRef.current) {
      polaroidZ += 1;
      cardRef.current.style.zIndex = String(polaroidZ);
    }
  }, []);

  const savePosition = useCallback(() => {
    const currentCaption = captionRef.current?.innerText ?? defaultCaption;
    storePolaroid(index, { x: x.get(), y: y.get(), caption: currentCaption });
  }, [index, x, y, defaultCaption]);

  const handleBlur = useCallback(() => {
    setEditing(false);
    const currentCaption = captionRef.current?.innerText ?? defaultCaption;
    storePolaroid(index, { x: x.get(), y: y.get(), caption: currentCaption });
  }, [index, x, y, defaultCaption]);

  useEffect(() => {
    if (storedRef.current?.caption && captionRef.current) {
      captionRef.current.innerText = storedRef.current.caption;
    }
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className={`polaroid-card absolute select-none ${editing ? "cursor-text" : "cursor-grab active:cursor-grabbing"}`}
      drag={!editing}
      dragConstraints={constraintsRef}
      dragElastic={0.05}
      dragMomentum={false}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
      onDragStart={bringToFront}
      onDragEnd={savePosition}
      onPointerDown={bringToFront}
      onDoubleClick={() => setEditing(true)}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      whileDrag={{
        scale: 1.03,
        boxShadow: "0 14px 30px rgba(0,0,0,0.2), 0 4px 10px rgba(0,0,0,0.1)",
        transition: { duration: 0 },
      }}
      transition={{
        duration: 0.4,
        delay: 0.4 + (index % 20) * 0.08,
        ease: "easeOut",
      }}
      style={{
        x,
        y,
        left: `calc(50% + ${cx}px - ${centerOffsetX}px)`,
        top: `calc(50% + ${cy}px - ${centerOffsetY}px)`,
        rotate: `${rot}deg`,
        zIndex: 9,
        willChange: "transform",
      }}
    >
      {/* Tape */}
      <div
        className="absolute -top-3 left-1/2 w-10 h-4 bg-white/40 shadow-sm backdrop-blur-[1px] z-10"
        style={{
          transform: `translateX(-50%) rotate(${index % 2 === 0 ? 2 : -1}deg)`,
        }}
      />

      {/* Polaroid frame */}
      <div
        className={`bg-white shadow-md ${small ? "p-1.5 pb-7" : "p-2 pb-12"}`}
        style={{
          width: `${frameW}px`,
          boxShadow: "0 4px 14px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.05)",
        }}
      >
        <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover object-top"
            sizes={`${frameW}px`}
            draggable={false}
          />
        </div>

        <div
          ref={captionRef}
          contentEditable={editing}
          suppressContentEditableWarning
          spellCheck={false}
          onBlur={handleBlur}
          className={`mt-1.5 font-[family-name:var(--font-handwritten)] text-charcoal/70 text-center outline-none whitespace-pre-wrap ${small ? "text-sm" : "text-lg"}`}
          style={{
            pointerEvents: editing ? "auto" : "none",
            caretColor: "rgba(0,0,0,0.4)",
            minHeight: small ? "20px" : "28px",
          }}
        >
          {defaultCaption}
        </div>
      </div>
    </motion.div>
  );
}

export default memo(PolaroidCard);
