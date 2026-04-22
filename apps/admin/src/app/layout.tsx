import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crystallise Admin",
  robots: { index: false, follow: false },
};

// Applied before hydration to avoid a flash of the wrong theme.
const themeInitScript = `(() => {
  try {
    const stored = localStorage.getItem("crystallise-admin-theme");
    const theme = stored === "light" || stored === "dark" ? stored : "system";
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = theme === "dark" || (theme === "system" && systemDark);
    if (dark) document.documentElement.classList.add("dark");
  } catch {}
})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
