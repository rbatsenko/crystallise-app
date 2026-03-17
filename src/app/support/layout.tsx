import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support an Idea — Crystallise",
  description:
    "Support creative climbing projects through Crystallise. Donate directly or join our Patreon to help fund films, events, and community-driven media.",
  openGraph: {
    title: "Support an Idea — Crystallise",
    description:
      "Support creative climbing projects through Crystallise. Donate or join our Patreon.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Support an Idea — Crystallise",
    description:
      "Support creative climbing projects through Crystallise. Donate or join our Patreon.",
  },
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
