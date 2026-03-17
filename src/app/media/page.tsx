"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Footer from "@/components/Footer";
import TornPaper from "@/components/TornPaper";
import PageTransition from "@/components/PageTransition";
import PageBackground from "@/components/PageBackground";

const mediaCategories = [
  {
    type: "Video",
    items: [
      { title: "The Crystal Line — Trailer", description: "A short film exploring movement and meaning on rock." },
      { title: "Voices from the Crag", description: "Documentary series capturing diverse climbing stories." },
    ],
    color: "#d4cdc4",
    rotation: -1,
  },
  {
    type: "Written",
    items: [
      { title: "On Falling", description: "An essay on the art of letting go and finding trust." },
      { title: "Stone & Story", description: "A collection of climbing narratives from around the world." },
    ],
    color: "#c9a84c",
    rotation: 1,
  },
  {
    type: "Audio",
    items: [
      { title: "The Crystallise Podcast", description: "Conversations with climbers, artists, and thinkers." },
      { title: "Soundscapes: The Vertical World", description: "Field recordings from crags and mountains." },
    ],
    color: "#b8a88a",
    rotation: -0.5,
  },
];

export default function MediaPage() {
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
            Media
          </motion.h1>
          <motion.p
            className="font-[family-name:var(--font-body)] text-slate text-center mb-12 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Creative climbing media — translating lived experience into words, photos, and film.
          </motion.p>

          <div className="space-y-10" style={{ perspective: "800px" }}>
            {mediaCategories.map((category, i) => (
              <motion.div
                key={category.type}
                initial={{ opacity: 0, y: 30, rotateX: 5 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.3 + i * 0.15,
                  ease: "easeOut",
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <TornPaper color={category.color} rotation={category.rotation}>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-4">
                    {category.type}
                  </h2>
                  <div className="space-y-4">
                    {category.items.map((item) => (
                      <div key={item.title} className="border-t border-charcoal/10 pt-3">
                        <h3 className="font-[family-name:var(--font-display)] text-base text-charcoal">
                          {item.title}
                        </h3>
                        <p className="font-[family-name:var(--font-body)] text-sm text-slate mt-1">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
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
