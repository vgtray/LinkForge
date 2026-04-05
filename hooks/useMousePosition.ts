"use client";

import { useState, useEffect, type RefObject } from "react";

interface MousePosition {
  x: number;
  y: number;
  elementX: number;
  elementY: number;
}

export function useMousePosition(ref?: RefObject<HTMLElement | null>): MousePosition {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    elementX: 0,
    elementY: 0,
  });

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      let elementX = 0;
      let elementY = 0;

      if (ref?.current) {
        const rect = ref.current.getBoundingClientRect();
        elementX = e.clientX - rect.left;
        elementY = e.clientY - rect.top;
      }

      setPosition({
        x: e.clientX,
        y: e.clientY,
        elementX,
        elementY,
      });
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [ref]);

  return position;
}
