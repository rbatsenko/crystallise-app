"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Footer from "@/components/Footer";
import TornPaper from "@/components/TornPaper";
import PageTransition from "@/components/PageTransition";
import PageBackground from "@/components/PageBackground";

export default function SupportPage() {
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

        <main className="max-w-2xl mx-auto px-6 py-12 flex-1">
          <motion.h1
            className="font-[family-name:var(--font-display)] text-4xl text-charcoal text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Support an Idea
          </motion.h1>
          <motion.p
            className="font-[family-name:var(--font-body)] text-slate text-center mb-12 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Help bring creative climbing projects to life.
          </motion.p>

          {/* About section */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: 5 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{ perspective: "800px", transformStyle: "preserve-3d" }}
          >
            <TornPaper color="#d4cdc4" rotation={-0.5}>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-3">
                Why Support Crystallise?
              </h2>
              <p className="font-[family-name:var(--font-body)] text-sm text-slate leading-relaxed mb-3">
                Crystallise is a non-profit organisation dedicated to financing
                and nurturing creative climbing media. Your support goes directly
                towards funding films, writing, photography, community events,
                and educational content that celebrates the art and culture of
                climbing.
              </p>
              <p className="font-[family-name:var(--font-body)] text-sm text-slate leading-relaxed">
                Every contribution helps an artist tell their story, a filmmaker
                capture a moment, or a community come together around what they
                love.
              </p>
            </TornPaper>
          </motion.div>

          {/* Donate */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 30, rotateX: 5 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            style={{ perspective: "800px", transformStyle: "preserve-3d" }}
          >
            <TornPaper color="#c9a84c" rotation={1}>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-3">
                Make a Donation
              </h2>
              <p className="font-[family-name:var(--font-body)] text-sm text-slate leading-relaxed mb-4">
                One-off donations will be available here soon via Stripe. In the
                meantime, reach out to us directly if you&apos;d like to support
                a project.
              </p>
              <div className="inline-block torn-paper bg-charcoal px-6 py-3 opacity-50 cursor-not-allowed">
                <span className="font-[family-name:var(--font-display)] text-cream text-sm tracking-wide">
                  Donate — Coming Soon
                </span>
              </div>
            </TornPaper>
          </motion.div>

          {/* Patreon */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 30, rotateX: 5 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            style={{ perspective: "800px", transformStyle: "preserve-3d" }}
          >
            <TornPaper color="#b8a88a" rotation={-0.8}>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-3">
                Join Our Patreon
              </h2>
              <p className="font-[family-name:var(--font-body)] text-sm text-slate leading-relaxed mb-4">
                For ongoing support, join us on Patreon. Monthly contributions
                help us plan ahead and commit to bigger, more ambitious
                projects.
              </p>
              <a
                href="https://www.patreon.com/crystallise"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block torn-paper bg-charcoal px-6 py-3 font-[family-name:var(--font-display)] text-cream text-sm tracking-wide hover:bg-charcoal/80 transition-colors"
                style={{ transform: "rotate(0.5deg)" }}
              >
                Join on Patreon &rarr;
              </a>
            </TornPaper>
          </motion.div>

          {/* What Crystallise has made possible */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 30, rotateX: 5 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            style={{ perspective: "800px", transformStyle: "preserve-3d" }}
          >
            <TornPaper color="#d4cdc4" rotation={0.5}>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-3">
                What Your Support Makes Possible
              </h2>
              <p className="font-[family-name:var(--font-body)] text-sm text-slate leading-relaxed mb-4">
                As projects are funded and completed, we&apos;ll showcase them
                here — so you can see exactly where your support goes and the
                creative work it brings to life.
              </p>
              <p className="font-[family-name:var(--font-handwritten)] text-lg text-slate/60 italic">
                Watch this space...
              </p>
            </TornPaper>
          </motion.div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
