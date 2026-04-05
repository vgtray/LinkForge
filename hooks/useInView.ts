"use client";

import { useRef, useState, useEffect, type RefObject } from "react";

interface UseInViewOptions {
  threshold?: number;
  triggerOnce?: boolean;
}

interface UseInViewReturn {
  ref: RefObject<HTMLDivElement | null>;
  isInView: boolean;
}

export function useInView({
  threshold = 0.1,
  triggerOnce = true,
}: UseInViewOptions = {}): UseInViewReturn {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, triggerOnce]);

  return { ref, isInView };
}
