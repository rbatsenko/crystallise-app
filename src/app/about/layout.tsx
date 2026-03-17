import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Crystallise",
  description:
    "Meet the team behind Crystallise and learn about our mission: financing creative climbing media, hosting community events, and producing educational content.",
  openGraph: {
    title: "About Us — Crystallise",
    description:
      "Meet the team behind Crystallise and learn about our mission to develop arts and culture within climbing.",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us — Crystallise",
    description:
      "Meet the team behind Crystallise and learn about our mission to develop arts and culture within climbing.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
