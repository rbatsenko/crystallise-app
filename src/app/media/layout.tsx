import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media — Crystallise",
  description:
    "Creative climbing media — films, articles, and exhibitions produced and supported by Crystallise.",
  openGraph: {
    title: "Media — Crystallise",
    description:
      "Creative climbing media — films, articles, and exhibitions by Crystallise.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Media — Crystallise",
    description:
      "Creative climbing media — films, articles, and exhibitions by Crystallise.",
  },
};

export default function MediaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
