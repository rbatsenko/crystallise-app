"use client";

import { motion, useMotionValue } from "framer-motion";
import { memo, useRef, useCallback, useState, useEffect } from "react";

interface StickyNoteProps {
  index: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
  rot: number;
  color: string;
  text: string;
  constraintsRef: React.RefObject<HTMLElement | null>;
}

let globalZ = 10;

function getStoredData(index: number) {
  try {
    const raw = localStorage.getItem(`note-${index}`);
    if (raw) return JSON.parse(raw) as { x: number; y: number; text: string };
  } catch {}
  return null;
}

function storeData(index: number, data: { x: number; y: number; text: string }) {
  try {
    localStorage.setItem(`note-${index}`, JSON.stringify(data));
  } catch {}
}

function StickyNote({
  index,
  w,
  h,
  cx,
  cy,
  rot,
  color,
  text: defaultText,
  constraintsRef,
}: StickyNoteProps) {
  const [editing, setEditing] = useState(false);
  const noteRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const storedRef = useRef(getStoredData(index));

  const x = useMotionValue(storedRef.current?.x ?? 0);
  const y = useMotionValue(storedRef.current?.y ?? 0);

  // Save position on drag end
  const savePosition = useCallback(() => {
    const currentText = textRef.current?.innerText ?? defaultText;
    storeData(index, { x: x.get(), y: y.get(), text: currentText });
  }, [index, x, y, defaultText]);

  // Save text on blur
  const handleBlur = useCallback(() => {
    setEditing(false);
    const currentText = textRef.current?.innerText ?? defaultText;
    storeData(index, { x: x.get(), y: y.get(), text: currentText });
  }, [index, x, y, defaultText]);

  const bringToFront = useCallback(() => {
    if (noteRef.current) {
      globalZ += 1;
      noteRef.current.style.zIndex = String(globalZ);
    }
  }, []);

  // Set stored text on mount
  useEffect(() => {
    if (storedRef.current?.text && textRef.current) {
      textRef.current.innerText = storedRef.current.text;
    }
  }, []);

  return (
    <motion.div
      ref={noteRef}
      className={`sticky-note absolute select-none ${editing ? "cursor-text" : "cursor-grab active:cursor-grabbing"}`}
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
        boxShadow: "0 12px 28px rgba(0,0,0,0.2), 0 4px 10px rgba(0,0,0,0.1)",
        transition: { duration: 0 },
      }}
      transition={{
        duration: 0.35,
        delay: 0.2 + (index % 20) * 0.05,
        ease: "easeOut",
      }}
      style={{
        x,
        y,
        width: `${w}px`,
        height: `${h}px`,
        left: `calc(50% + ${cx}px - ${w / 2}px)`,
        top: `calc(50% + ${cy}px - ${h / 2}px)`,
        rotate: `${rot}deg`,
        zIndex: 10,
        backgroundColor: color,
        borderRadius: "8px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.05)",
        willChange: "transform",
      }}
    >
      {/* Tape */}
      <div
        className="absolute -top-3 left-1/2 w-8 h-4 bg-white/40 shadow-sm backdrop-blur-[1px]"
        style={{
          transform: `translateX(-50%) rotate(${index % 2 === 0 ? -2 : 1}deg)`,
        }}
      />

      <div
        ref={textRef}
        contentEditable={editing}
        suppressContentEditableWarning
        spellCheck={false}
        onBlur={handleBlur}
        className="w-full h-full p-4 font-[family-name:var(--font-handwritten)] text-3xl leading-[40px] text-charcoal/85 outline-none overflow-hidden whitespace-pre-wrap relative"
        style={{
          pointerEvents: editing ? "auto" : "none",
          caretColor: "rgba(0,0,0,0.5)",
          backgroundImage: "repeating-linear-gradient(transparent, transparent 39px, rgba(0, 0, 0, 0.1) 39px, rgba(0, 0, 0, 0.1) 40px)",
          backgroundPosition: "0 12px",
        }}
      >
        {defaultText}
      </div>
    </motion.div>
  );
}

export default memo(StickyNote);
