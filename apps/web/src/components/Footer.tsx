import Image from "next/image";
import Link from "next/link";

export default function Footer({ transparent = false }: { transparent?: boolean }) {
  return (
    <footer
      className={`relative z-50 py-12 px-6 ${
        transparent ? "bg-transparent" : "bg-black/20 backdrop-blur-sm border-t border-white/10"
      }`}
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image
            src="/images/crystallise-logo-no-text.png"
            alt="Crystallise - Back to Home"
            width={40}
            height={40}
            className="invert drop-shadow-md"
          />
        </Link>
        <nav className="flex flex-wrap justify-center gap-6 text-sm text-white/80 font-[family-name:var(--font-body)]">
          <Link href="/support" className="hover:text-white transition-colors">Support an Idea</Link>
          <Link href="/propose" className="hover:text-white transition-colors">Pitch an Idea</Link>
          <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
          <Link href="/events" className="hover:text-white transition-colors">Events</Link>
          <Link href="/media" className="hover:text-white transition-colors">Media</Link>
        </nav>
        <p className="text-xs text-white/60">
          &copy; {new Date().getFullYear()} Crystallise. A non-profit organisation.
        </p>
      </div>
    </footer>
  );
}
