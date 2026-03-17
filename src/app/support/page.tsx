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

        <main className="max-w-2xl mx-auto px-6 py-12">
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

          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: 5 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{ perspective: "800px", transformStyle: "preserve-3d" }}
          >
            <TornPaper color="#d4cdc4" rotation={-0.5}>
              <div className="text-center py-8">
                <div className="font-[family-name:var(--font-display)] text-6xl text-stone/40 mb-6">
                  &hearts;
                </div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-4">
                  Coming Soon
                </h2>
                <p className="font-[family-name:var(--font-body)] text-sm text-slate leading-relaxed max-w-sm mx-auto">
                  We&apos;re building a way for you to directly support creative
                  climbing projects. Payments via Stripe will be available here
                  soon.
                </p>
                <p className="font-[family-name:var(--font-body)] text-xs text-slate/60 mt-6">
                  In the meantime, reach out to us directly if you&apos;d like to
                  support a project.
                </p>
              </div>
            </TornPaper>
          </motion.div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
