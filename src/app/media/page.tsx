"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Footer from "@/components/Footer";
import TornPaper from "@/components/TornPaper";
import PageTransition from "@/components/PageTransition";
import PageBackground from "@/components/PageBackground";

const videos: { title: string; description: string; youtubeId: string | null; interviews: string[] }[] = [];

const articles: { title: string; description: string; external: boolean }[] = [];

const exhibitions: { title: string; artist: string; description: string }[] = [];

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
            Creative climbing media — translating lived experience into words,
            photos, and film.
          </motion.p>

          <div className="space-y-12">
            {/* Videos */}
            <motion.div
              initial={{ opacity: 0, y: 30, rotateX: 5 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
              style={{
                perspective: "800px",
                transformStyle: "preserve-3d",
              }}
            >
              <TornPaper color="#d4cdc4" rotation={-1}>
                <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-4">
                  Videos
                </h2>
                {videos.length > 0 ? (
                  <div className="space-y-6">
                    {videos.map((video) => (
                      <div key={video.title}>
                        <div className="aspect-video bg-charcoal/10 border border-stone/30 flex items-center justify-center mb-3">
                          <span className="font-[family-name:var(--font-body)] text-sm text-slate/50">
                            Video coming soon
                          </span>
                        </div>
                        <h3 className="font-[family-name:var(--font-display)] text-lg text-charcoal">
                          {video.title}
                        </h3>
                        <p className="font-[family-name:var(--font-body)] text-sm text-slate mt-1">
                          {video.description}
                        </p>
                        {video.interviews.length > 0 && (
                          <div className="mt-2">
                            {video.interviews.map((interview) => (
                              <span
                                key={interview}
                                className="inline-block font-[family-name:var(--font-body)] text-xs text-gold border-b border-gold/40 mr-4"
                              >
                                {interview}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-[family-name:var(--font-body)] text-sm text-slate/60">
                    Films and videos will be shared here once they&apos;re ready.
                  </p>
                )}
              </TornPaper>
            </motion.div>

            {/* Articles */}
            <motion.div
              initial={{ opacity: 0, y: 30, rotateX: 5 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.45, duration: 0.6, ease: "easeOut" }}
              style={{
                perspective: "800px",
                transformStyle: "preserve-3d",
              }}
            >
              <TornPaper color="#c9a84c" rotation={1}>
                <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-4">
                  Articles
                </h2>
                {articles.length > 0 ? (
                  <div className="space-y-5">
                    {articles.map((article) => (
                      <div
                        key={article.title}
                        className="border-t border-charcoal/10 pt-4"
                      >
                        <h3 className="font-[family-name:var(--font-display)] text-xl text-charcoal">
                          {article.title}
                        </h3>
                        <p className="font-[family-name:var(--font-body)] text-sm text-slate mt-1">
                          {article.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-[family-name:var(--font-body)] text-sm text-slate/60">
                    Written pieces and interviews will live here.
                  </p>
                )}
              </TornPaper>
            </motion.div>

            {/* Exhibitions */}
            <motion.div
              initial={{ opacity: 0, y: 30, rotateX: 5 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
              style={{
                perspective: "800px",
                transformStyle: "preserve-3d",
              }}
            >
              <TornPaper color="#b8a88a" rotation={-0.5}>
                <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-4">
                  Exhibitions
                </h2>
                {exhibitions.length > 0 ? (
                  <div className="space-y-6">
                    {exhibitions.map((exhibition) => (
                      <div key={exhibition.title}>
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          {[1, 2, 3].map((n) => (
                            <div
                              key={n}
                              className="aspect-square bg-charcoal/8 border border-stone/20"
                            />
                          ))}
                        </div>
                        <h3 className="font-[family-name:var(--font-display)] text-lg text-charcoal">
                          {exhibition.title}
                        </h3>
                        <span className="font-[family-name:var(--font-body)] text-xs text-slate/60 uppercase tracking-widest">
                          {exhibition.artist}
                        </span>
                        <p className="font-[family-name:var(--font-body)] text-sm text-slate mt-2 leading-relaxed">
                          {exhibition.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-[family-name:var(--font-body)] text-sm text-slate/60">
                    Photo and art exhibitions will be showcased here.
                  </p>
                )}
              </TornPaper>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
