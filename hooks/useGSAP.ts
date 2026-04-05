"use client";

import { useEffect, useRef, type DependencyList } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useGSAP(
  callback: (ctx: gsap.Context) => void,
  deps: DependencyList = [],
  scope?: React.RefObject<HTMLElement | null>
) {
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    ctxRef.current = gsap.context(() => {
      callback(ctxRef.current!);
    }, scope?.current || undefined);

    return () => {
      ctxRef.current?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
