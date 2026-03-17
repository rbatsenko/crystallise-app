"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Footer from "@/components/Footer";
import TornPaper from "@/components/TornPaper";
import PageTransition from "@/components/PageTransition";
import PageBackground from "@/components/PageBackground";

const placeholderEvents = [
  {
    title: "Film Night: Climbing Stories",
    date: "Coming Soon",
    description: "An evening of short films celebrating climbing culture, storytelling, and the vertical world.",
    color: "#d4cdc4",
    rotation: -1,
  },
  {
    title: "Poetry & The Precipice",
    date: "Coming Soon",
    description: "A reading and open-mic event exploring the intersection of climbing and creative writing.",
    color: "#c9a84c",
    rotation: 1.5,
  },
  {
    title: "Workshop: Visual Storytelling",
    date: "Coming Soon",
    description: "Learn the art of translating climbing experiences into compelling visual narratives.",
    color: "#b8a88a",
    rotation: -0.5,
  },
];

export default function EventsPage() {
  return (
    <PageTransition>
      <div className="min-h-screen">
        <PageBackground />
        <div className="px-6 pt-6">
          <Link
            href="/"
            className="text-slate hover:text-charcoal transition-colors font-[family-name:var(--font-body)] text-sm"
          >
            &larr; Back
          </Link>
        </div>

        <main className="max-w-3xl mx-auto px-6 py-12">
          <motion.h1
            className="font-[family-name:var(--font-display)] text-4xl text-charcoal text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Events
          </motion.h1>
          <motion.p
            className="font-[family-name:var(--font-body)] text-slate text-center mb-12 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Community hubs offering the physical space for inspiration to be shared.
          </motion.p>

          <div className="space-y-6" style={{ perspective: "800px" }}>
            {placeholderEvents.map((event, i) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 30, rotateX: 5 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.3 + i * 0.12,
                  ease: "easeOut",
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <TornPaper color={event.color} rotation={event.rotation}>
                  <span className="font-[family-name:var(--font-body)] text-xs text-slate/70 uppercase tracking-widest">
                    {event.date}
                  </span>
                  <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mt-1 mb-2">
                    {event.title}
                  </h2>
                  <p className="font-[family-name:var(--font-body)] text-sm text-slate leading-relaxed">
                    {event.description}
                  </p>
                </TornPaper>
              </motion.div>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
