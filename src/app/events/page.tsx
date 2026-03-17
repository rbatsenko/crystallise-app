"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import PageBackground from "@/components/PageBackground";

const placeholderEvents = [
  {
    title: "Film Night: Climbing Stories",
    date: "Coming Soon",
    location: "TBA",
    description:
      "An evening of short films celebrating climbing culture, storytelling, and the vertical world. Grab a drink, settle in, and let the stories wash over you.",
    color: "#1a1a1a",
    accent: "#c9a84c",
  },
  {
    title: "Poetry & The Precipice",
    date: "Coming Soon",
    location: "TBA",
    description:
      "A reading and open-mic event exploring the intersection of climbing and creative writing. Bring your words, or just come to listen.",
    color: "#2a2520",
    accent: "#b8a88a",
  },
  {
    title: "Workshop: Visual Storytelling",
    date: "Coming Soon",
    location: "TBA",
    description:
      "Learn the art of translating climbing experiences into compelling visual narratives. From camera to edit — an afternoon of hands-on learning.",
    color: "#1a1a1a",
    accent: "#d4cdc4",
  },
];

export default function EventsPage() {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <PageBackground />
        <div className="px-6 pt-6">
          <Link
            href="/"
            className="text-slate hover:text-charcoal transition-colors font-[family-name:var(--font-body)] text-sm"
          >
            &larr; Back
          </Link>
        </div>

        <main className="flex-1 max-w-3xl mx-auto px-6 py-12">
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
            Community hubs offering the physical space for inspiration to be
            shared.
          </motion.p>

          <div className="space-y-10">
            {placeholderEvents.map((event, i) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.3 + i * 0.15,
                  ease: "easeOut",
                }}
              >
                {/* Poster card */}
                <div
                  className="relative overflow-hidden grain-overlay"
                  style={{
                    backgroundColor: event.color,
                    boxShadow:
                      "4px 6px 20px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.15)",
                  }}
                >
                  {/* Top accent bar */}
                  <div
                    className="h-1.5"
                    style={{ backgroundColor: event.accent }}
                  />

                  <div className="px-8 py-10 sm:px-10 sm:py-12">
                    {/* Date & Location */}
                    <div className="flex justify-between items-start mb-6">
                      <span
                        className="font-[family-name:var(--font-body)] text-xs uppercase tracking-[0.25em]"
                        style={{ color: event.accent }}
                      >
                        {event.date}
                      </span>
                      <span
                        className="font-[family-name:var(--font-body)] text-xs uppercase tracking-[0.15em]"
                        style={{ color: `${event.accent}80` }}
                      >
                        {event.location}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl text-cream leading-tight mb-4">
                      {event.title}
                    </h2>

                    {/* Divider */}
                    <div
                      className="w-12 h-px mb-5"
                      style={{ backgroundColor: event.accent }}
                    />

                    {/* Description */}
                    <p className="font-[family-name:var(--font-body)] text-sm text-cream/70 leading-relaxed mb-8 max-w-lg">
                      {event.description}
                    </p>

                    {/* Book Now button */}
                    <button
                      className="px-6 py-2.5 border text-sm font-[family-name:var(--font-display)] tracking-wide transition-colors cursor-not-allowed opacity-60"
                      style={{
                        borderColor: event.accent,
                        color: event.accent,
                      }}
                      disabled
                    >
                      Book Now
                    </button>
                  </div>

                  {/* Bottom accent */}
                  <div
                    className="h-0.5 opacity-40"
                    style={{ backgroundColor: event.accent }}
                  />
                </div>

                {/* Print hint */}
                <p className="text-right mt-2 font-[family-name:var(--font-body)] text-xs text-slate/40">
                  print-friendly poster
                </p>
              </motion.div>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
