import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pitch an Idea — Crystallise",
  description:
    "Got a creative climbing project? Submit your proposal to Crystallise — we fund films, writing, photography, and more.",
  openGraph: {
    title: "Pitch an Idea — Crystallise",
    description:
      "Got a creative climbing project? Submit your proposal to Crystallise.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pitch an Idea — Crystallise",
    description:
      "Got a creative climbing project? Submit your proposal to Crystallise.",
  },
};

export default function ProposeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
