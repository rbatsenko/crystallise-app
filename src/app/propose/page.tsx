"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import PageBackground from "@/components/PageBackground";

const inputClasses =
  "w-full bg-cream border border-stone/40 rounded-none px-4 py-3 font-[family-name:var(--font-body)] text-charcoal text-sm focus:outline-none focus:border-gold transition-colors";

const labelClasses =
  "block font-[family-name:var(--font-display)] text-sm text-charcoal mb-2";

const CHAR_LIMITS = {
  overview: 500,
  deliverables: 300,
  budget: 200,
  budgetBreakdown: 500,
  additional: 300,
};

export default function ProposePage() {
  const [charCounts, setCharCounts] = useState<Record<string, number>>({});

  const handleCharCount = (field: string, value: string) => {
    setCharCounts((prev) => ({ ...prev, [field]: value.length }));
  };

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

        <main className="flex-1 max-w-2xl mx-auto px-6 py-12">
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
            {/* Name */}
            <div>
              <label htmlFor="name" className={labelClasses}>
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={inputClasses}
                placeholder="..."
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={labelClasses}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={inputClasses}
                placeholder="..."
              />
            </div>

            {/* General Overview */}
            <div>
              <label htmlFor="overview" className={labelClasses}>
                General Overview
              </label>
              <textarea
                id="overview"
                name="overview"
                rows={4}
                maxLength={CHAR_LIMITS.overview}
                className={`${inputClasses} resize-none`}
                placeholder="Describe your project idea — what is it, and why does it matter?"
                onChange={(e) => handleCharCount("overview", e.target.value)}
              />
              <p className="text-xs text-slate/50 mt-1 text-right font-[family-name:var(--font-body)]">
                {charCounts.overview || 0}/{CHAR_LIMITS.overview}
              </p>
            </div>

            {/* Deliverables */}
            <div>
              <label htmlFor="deliverables" className={labelClasses}>
                Deliverables
              </label>
              <textarea
                id="deliverables"
                name="deliverables"
                rows={3}
                maxLength={CHAR_LIMITS.deliverables}
                className={`${inputClasses} resize-none`}
                placeholder="What will the project produce? (e.g. a short film, a zine, a photo series...)"
                onChange={(e) => handleCharCount("deliverables", e.target.value)}
              />
              <p className="text-xs text-slate/50 mt-1 text-right font-[family-name:var(--font-body)]">
                {charCounts.deliverables || 0}/{CHAR_LIMITS.deliverables}
              </p>
            </div>

            {/* Required Budget */}
            <div>
              <label htmlFor="budget" className={labelClasses}>
                Required Budget
              </label>
              <textarea
                id="budget"
                name="budget"
                rows={2}
                maxLength={CHAR_LIMITS.budget}
                className={`${inputClasses} resize-none`}
                placeholder="How much funding do you need, roughly?"
                onChange={(e) => handleCharCount("budget", e.target.value)}
              />
              <p className="text-xs text-slate/50 mt-1 text-right font-[family-name:var(--font-body)]">
                {charCounts.budget || 0}/{CHAR_LIMITS.budget}
              </p>
            </div>

            {/* Budget Breakdown */}
            <div>
              <label htmlFor="budgetBreakdown" className={labelClasses}>
                Budget Breakdown
              </label>
              <textarea
                id="budgetBreakdown"
                name="budgetBreakdown"
                rows={4}
                maxLength={CHAR_LIMITS.budgetBreakdown}
                className={`${inputClasses} resize-none`}
                placeholder="Break down how the budget would be spent (e.g. equipment hire, travel, editing...)"
                onChange={(e) =>
                  handleCharCount("budgetBreakdown", e.target.value)
                }
              />
              <p className="text-xs text-slate/50 mt-1 text-right font-[family-name:var(--font-body)]">
                {charCounts.budgetBreakdown || 0}/{CHAR_LIMITS.budgetBreakdown}
              </p>
            </div>

            {/* Additional Information */}
            <div>
              <label htmlFor="additional" className={labelClasses}>
                Additional Information
              </label>
              <textarea
                id="additional"
                name="additional"
                rows={3}
                maxLength={CHAR_LIMITS.additional}
                className={`${inputClasses} resize-none`}
                placeholder="Anything else you'd like us to know?"
                onChange={(e) => handleCharCount("additional", e.target.value)}
              />
              <p className="text-xs text-slate/50 mt-1 text-right font-[family-name:var(--font-body)]">
                {charCounts.additional || 0}/{CHAR_LIMITS.additional}
              </p>
            </div>

            {/* Supporting Images */}
            <div>
              <label htmlFor="images" className={labelClasses}>
                Supporting Images
              </label>
              <p className="text-xs text-slate/60 mb-2 font-[family-name:var(--font-body)]">
                Upload any reference images, mood boards, or visuals that help
                convey your idea.
              </p>
              <input
                type="file"
                id="images"
                name="images"
                multiple
                accept="image/*"
                className="w-full font-[family-name:var(--font-body)] text-sm text-slate file:mr-4 file:py-2 file:px-4 file:border file:border-stone/40 file:bg-cream/60 file:text-charcoal file:text-sm file:font-[family-name:var(--font-body)] file:cursor-pointer file:rounded-none hover:file:bg-cream transition-colors"
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
