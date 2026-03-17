import { ReactNode } from "react";

interface TornPaperProps {
  children: ReactNode;
  className?: string;
  color?: string;
  rotation?: number;
  variant?: 1 | 2 | 3;
}

export default function TornPaper({
  children,
  className = "",
  color = "#d4cdc4",
  rotation = 0,
  variant = 1,
}: TornPaperProps) {
  return (
    <div
      className={`torn-paper-${variant} torn-nav-item px-8 py-6 ${className}`}
      style={{
        backgroundColor: color,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {children}
    </div>
  );
}
