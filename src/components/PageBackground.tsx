import Image from "next/image";

const HERO_BG_COLOR = "#8a8a8a";

export default function PageBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none select-none" style={{ backgroundColor: HERO_BG_COLOR }}>
      {/* Mobile: portrait artwork */}
      <Image
        src="/images/hero-bg.jpg"
        alt=""
        fill
        className="object-cover object-top md:hidden"
        priority
      />
      {/* Desktop: landscape artwork */}
      <Image
        src="/images/hero-bg-desktop.jpg"
        alt=""
        fill
        className="hidden md:block object-cover object-center"
        priority
      />
    </div>
  );
}
