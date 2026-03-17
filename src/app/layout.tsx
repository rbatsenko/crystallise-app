import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Caveat } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-handwritten",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Crystallise - Arts & Culture in Climbing",
  description:
    "A non-profit organisation focused on developing the arts and culture within climbing media. Financing creative storytelling, hosting community events, and producing educational content.",
  keywords: ["climbing", "arts", "culture", "non-profit", "creative media", "climbing film", "community events", "storytelling"],
  authors: [{ name: "Crystallise" }],
  openGraph: {
    title: "Crystallise - Arts & Culture in Climbing",
    description: "A non-profit organisation focused on developing the arts and culture within climbing media.",
    type: "website",
    locale: "en_GB",
    siteName: "Crystallise",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crystallise - Arts & Culture in Climbing",
    description: "A non-profit organisation focused on developing the arts and culture within climbing media.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${dmSans.variable} ${caveat.variable} antialiased min-h-screen bg-[#fdfbf7]`}
      >
        {children}
      </body>
    </html>
  );
}
