export default function PageBackground() {
  return (
    <>
      <div
        className="fixed inset-0 z-0 opacity-20 mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(120, 140, 200, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(120, 140, 200, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          backgroundPosition: "center top",
        }}
      />
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30 mix-blend-multiply bg-[url('/images/paper-texture.png')] bg-repeat" />
    </>
  );
}
