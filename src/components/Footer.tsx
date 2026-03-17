import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-50 bg-white border-t border-stone/30 py-12 px-6">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image
            src="/images/crystallise-logo-no-text.png"
            alt="Crystallise — Back to Home"
            width={40}
            height={40}
          />
        </Link>
        <nav className="flex flex-wrap justify-center gap-6 text-sm text-slate font-[family-name:var(--font-body)]">
          <Link href="/support" className="hover:text-charcoal transition-colors">Support an Idea</Link>
          <Link href="/propose" className="hover:text-charcoal transition-colors">Pitch an Idea</Link>
          <Link href="/about" className="hover:text-charcoal transition-colors">About Us</Link>
          <Link href="/events" className="hover:text-charcoal transition-colors">Events</Link>
          <Link href="/media" className="hover:text-charcoal transition-colors">Media</Link>
        </nav>
        <p className="text-xs text-slate/60">
          &copy; {new Date().getFullYear()} Crystallise. A non-profit organisation.
        </p>
      </div>
    </footer>
  );
}
