import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events — Crystallise",
  description:
    "Community events by Crystallise — film nights, workshops, readings, and more. Spaces where climbing culture and creativity meet in person.",
  openGraph: {
    title: "Events — Crystallise",
    description:
      "Community events by Crystallise — film nights, workshops, readings, and more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Events — Crystallise",
    description:
      "Community events by Crystallise — film nights, workshops, readings, and more.",
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
