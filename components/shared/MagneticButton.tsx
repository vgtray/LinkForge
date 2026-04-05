"use client";

import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  magnetStrength?: number;
}

export function MagneticButton({
  children,
  className,
  magnetStrength = 0.3,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = (e.clientX - centerX) * magnetStrength;
    const distY = (e.clientY - centerY) * magnetStrength;
    const maxDist = 20;
    setOffset({
      x: Math.max(-maxDist, Math.min(maxDist, distX)),
      y: Math.max(-maxDist, Math.min(maxDist, distY)),
    });
  }

  function handleMouseLeave() {
    setOffset({ x: 0, y: 0 });
  }

  return (
    <div
      ref={ref}
      className={cn("inline-block", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: "transform 0.3s cubic-bezier(0.33, 1, 0.68, 1)",
      }}
    >
      {children}
    </div>
  );
}
