"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import Footer from "@/components/Footer";
import TornPaper from "@/components/TornPaper";
import PageTransition from "@/components/PageTransition";

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable; ignore
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:gap-3 sm:items-center">
      <dt className="text-slate/70 sm:w-36 shrink-0">{label}</dt>
      <dd className="flex items-center gap-2 min-w-0 flex-1">
        <span className="text-charcoal font-medium tracking-wide break-all">{value}</span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy ${label}`}
          className="shrink-0 text-xs text-slate/70 hover:text-charcoal transition-colors px-2 py-0.5 rounded border border-slate/20 hover:border-slate/40 bg-white/30 hover:bg-white/50"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </dd>
    </div>
  );
}

export default function SupportPage() {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <div className="px-6 pt-6">
          <Link
            href="/"
            className="text-white/70 hover:text-white transition-colors font-[family-name:var(--font-body)] text-sm bg-black/20 backdrop-blur-sm rounded-full px-4 py-1.5 inline-block"
          >
            &larr; Back
          </Link>
        </div>

        <main className="max-w-2xl mx-auto px-6 py-12 flex-1">
          <motion.div
            className="bg-black/20 backdrop-blur-sm rounded-2xl px-8 py-6 mb-12 max-w-md mx-auto"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-[family-name:var(--font-display)] text-4xl text-white text-center mb-3">
              Support an Idea
            </h1>
            <p className="font-[family-name:var(--font-body)] text-white/80 text-center">
              Help bring creative climbing projects to life.
            </p>
          </motion.div>

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
                You can support us directly by bank transfer using the details
                below. Card donations via Stripe will be available here soon.
              </p>
              <dl className="font-[family-name:var(--font-body)] text-sm space-y-2.5">
                <CopyField label="Account name" value="CRYSTALLISE MEDIA CIC" />
                <CopyField label="Sort code" value="08-92-99" />
                <CopyField label="Account number" value="67509557-00" />
                <CopyField label="IBAN" value="GB88CPBK08929967509557" />
                <CopyField label="BIC" value="CPBKGB22" />
              </dl>
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
              <div
                className="inline-block torn-paper bg-charcoal px-6 py-3 opacity-50 cursor-not-allowed"
                style={{ transform: "rotate(0.5deg)" }}
                aria-disabled="true"
              >
                <span className="font-[family-name:var(--font-display)] text-cream text-sm tracking-wide">
                  Patreon — Coming Soon
                </span>
              </div>
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
