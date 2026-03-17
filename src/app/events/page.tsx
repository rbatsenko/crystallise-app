"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import PageBackground from "@/components/PageBackground";

const events = [
  {
    title: "Crystallise Launch",
    date: "Saturday 21st March",
    location: "MURO — 845 Brayards Rd, London SE15 3RD",
    description:
      "2pm — Film screenings: squ(h)amish II by Hamish McArthur, MOYO, and Spirit Quest by Quinn Mason. 3:30pm — Crystallise Launch Q&A. 5–11pm — Climbing, DJs, drinks, and food. Raffles, auctions, and giveaways from Arc'teryx and Tension Climbing.",
    color: "#1a1a1a",
    accent: "#c9a84c",
    bookingUrl: "https://www.muroclimbing.com/page/crystallise",
    poster: "/images/crystallise-launch.jpeg",
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
            {events.map((event, i) => (
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
                  {/* Poster image */}
                  {event.poster && (
                    <Image
                      src={event.poster}
                      alt={`${event.title} poster`}
                      width={800}
                      height={1000}
                      className="w-full"
                    />
                  )}

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

                    {/* Actions */}
                    <div className="flex flex-wrap gap-4 items-center">
                      {event.bookingUrl ? (
                        <a
                          href={event.bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-6 py-2.5 border text-sm font-[family-name:var(--font-display)] tracking-wide transition-colors hover:bg-white/10"
                          style={{
                            borderColor: event.accent,
                            color: event.accent,
                          }}
                        >
                          Book Now &rarr;
                        </a>
                      ) : (
                        <button
                          className="px-6 py-2.5 border text-sm font-[family-name:var(--font-display)] tracking-wide cursor-not-allowed opacity-60"
                          style={{
                            borderColor: event.accent,
                            color: event.accent,
                          }}
                          disabled
                        >
                          Book Now
                        </button>
                      )}

                      {event.poster && (
                        <>
                          <a
                            href={event.poster}
                            download
                            className="inline-block px-5 py-2.5 text-sm font-[family-name:var(--font-body)] text-cream/50 hover:text-cream/80 transition-colors"
                          >
                            Download Poster
                          </a>
                          <button
                            onClick={() => {
                              const w = window.open("", "_blank");
                              if (!w) return;
                              w.document.write(`<html><head><title>${event.title}</title><style>@media print{body{margin:0}img{width:100%;height:auto}}</style></head><body><img src="${event.poster}" onload="window.print();window.close()" /></body></html>`);
                              w.document.close();
                            }}
                            className="inline-block px-5 py-2.5 text-sm font-[family-name:var(--font-body)] text-cream/50 hover:text-cream/80 transition-colors cursor-pointer"
                          >
                            Print Poster
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Bottom accent */}
                  <div
                    className="h-0.5 opacity-40"
                    style={{ backgroundColor: event.accent }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
