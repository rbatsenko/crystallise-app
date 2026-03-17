"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import PageBackground from "@/components/PageBackground";

export default function ProposePage() {
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
            Pitch an Idea
          </motion.h1>
          <motion.p
            className="font-[family-name:var(--font-body)] text-slate text-center mb-12 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Have a creative climbing project in mind? We want to hear about it.
          </motion.p>

          <motion.form
            className="torn-paper bg-warm-gray px-8 py-10 space-y-6"
            style={{ transform: "rotate(-0.5deg)" }}
            initial={{ opacity: 0, y: 30, rotateX: 5 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label
                htmlFor="name"
                className="block font-[family-name:var(--font-display)] text-sm text-charcoal mb-2"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full bg-cream/60 border border-stone/40 rounded-none px-4 py-3 font-[family-name:var(--font-body)] text-charcoal text-sm focus:outline-none focus:border-gold transition-colors"
                placeholder="..."
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block font-[family-name:var(--font-display)] text-sm text-charcoal mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full bg-cream/60 border border-stone/40 rounded-none px-4 py-3 font-[family-name:var(--font-body)] text-charcoal text-sm focus:outline-none focus:border-gold transition-colors"
                placeholder="..."
              />
            </div>

            <div>
              <label
                htmlFor="idea"
                className="block font-[family-name:var(--font-display)] text-sm text-charcoal mb-2"
              >
                Your Idea
              </label>
              <textarea
                id="idea"
                name="idea"
                rows={6}
                className="w-full bg-cream/60 border border-stone/40 rounded-none px-4 py-3 font-[family-name:var(--font-body)] text-charcoal text-sm focus:outline-none focus:border-gold transition-colors resize-none"
                placeholder="Tell us about your creative climbing project..."
              />
            </div>

            <button
              type="submit"
              className="torn-paper bg-gold px-8 py-3 font-[family-name:var(--font-display)] text-charcoal text-sm tracking-wide hover:bg-gold/80 transition-colors cursor-pointer"
              style={{ transform: "rotate(0.5deg)" }}
            >
              Submit Idea
            </button>
          </motion.form>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
