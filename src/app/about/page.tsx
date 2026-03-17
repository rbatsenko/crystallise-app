"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import TornPaper from "@/components/TornPaper";
import PageTransition from "@/components/PageTransition";
import PageBackground from "@/components/PageBackground";

const pillars = [
  {
    title: "Creative Media",
    description:
      "Our main role is to finance the production of creative climbing media that aligns with the values of sincerity and expression. Success to us is in the art of creative storytelling, of translating lived experience into words, photos and film. Just as crystals scatter light uniquely from every angle, we too must honour the full diversity of viewpoints in our culture to see its beauty.",
    color: "#d4cdc4",
    rotation: -1,
  },
  {
    title: "Community Events",
    description:
      "The second branch of Crystallise is to host regular, in person events — ranging from movie nights to workshops, and from poetry readings to panel discussions. These community hubs offer the physical space for inspiration to be shared. Our events will be a catalyst for the blossoming of projects and connections.",
    color: "#c9a84c",
    rotation: 1.5,
  },
  {
    title: "Educational Content",
    description:
      "Our third capacity is to produce expansive, educational media, investigating social and environmental topics related to climbing and the outdoors. By better understanding the foundations of our community, we are equipped to navigate the precipice that climbing finds itself on.",
    color: "#b8a88a",
    rotation: -0.5,
  },
];

const team = [
  {
    name: "Hamish",
    role: "Founder",
    bio: "A climber, filmmaker, and dreamer — Hamish started Crystallise to channel the creative energy of the climbing community into something lasting.",
  },
  {
    name: "Daniel",
    role: "Co-Founder",
    bio: "Helping shape the vision and direction of Crystallise, bringing ideas to life and keeping the momentum going.",
  },
  {
    name: "Roman",
    role: "Developer",
    bio: "Software engineer building the digital home for Crystallise, making sure the website reflects the same care and craft as the projects it supports.",
  },
];

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <PageBackground />
        {/* Back nav */}
        <div className="px-6 pt-6">
          <Link
            href="/"
            className="text-slate hover:text-charcoal transition-colors font-[family-name:var(--font-body)] text-sm"
          >
            &larr; Back
          </Link>
        </div>

        <main className="flex-1 max-w-3xl mx-auto px-6 py-12">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src="/images/crystallise-logo.png"
              alt="Crystallise"
              width={160}
              height={48}
              className="mx-auto mb-8"
            />
            <p className="font-[family-name:var(--font-body)] text-lg text-slate max-w-xl mx-auto leading-relaxed">
              A non-profit organisation focused on developing the arts and
              culture within climbing media.
            </p>
          </motion.div>

          {/* Mission statement */}
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <p className="font-[family-name:var(--font-body)] text-base text-slate leading-relaxed max-w-lg mx-auto">
              We are at a key moment in the history of our sport — our lifestyle.
              Will we seek expression or attention? Inspiration or cash? Love or
              cynicism? Crystallise is a gentle nudge towards the former, and a
              step towards a future we dream is possible.
            </p>
          </motion.div>

          {/* Three Pillars */}
          <div className="space-y-8" style={{ perspective: "800px" }}>
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{
                  opacity: 0,
                  y: 30,
                  rotateX: 5,
                  rotateZ: pillar.rotation * 2,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  rotateX: 0,
                  rotateZ: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.3 + i * 0.15,
                  ease: "easeOut",
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <TornPaper color={pillar.color} rotation={pillar.rotation}>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-3">
                    {pillar.title}
                  </h2>
                  <p className="font-[family-name:var(--font-body)] text-sm text-slate leading-relaxed">
                    {pillar.description}
                  </p>
                </TornPaper>
              </motion.div>
            ))}
          </div>

          {/* The Team */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-charcoal text-center mb-8">
              The Team
            </h2>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              style={{ perspective: "800px" }}
            >
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20, rotateX: 5 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.9 + i * 0.15,
                    ease: "easeOut",
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <TornPaper
                    color={i % 2 === 0 ? "#d4cdc4" : "#b8a88a"}
                    rotation={i % 2 === 0 ? -1 : 1}
                    variant={i % 2 === 0 ? 2 : 3}
                  >
                    <h3 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-1">
                      {member.name}
                    </h3>
                    <span className="font-[family-name:var(--font-body)] text-xs text-slate/70 uppercase tracking-widest">
                      {member.role}
                    </span>
                    <p className="font-[family-name:var(--font-body)] text-sm text-slate leading-relaxed mt-3">
                      {member.bio}
                    </p>
                  </TornPaper>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
