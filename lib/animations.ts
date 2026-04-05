import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function fadeInUp(element: gsap.TweenTarget, delay = 0) {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay,
      ease: "power3.out",
    }
  );
}

export function staggerReveal(elements: gsap.TweenTarget, stagger = 0.1) {
  return gsap.fromTo(
    elements,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger,
      ease: "power2.out",
    }
  );
}

export function textRevealAnimation(element: HTMLElement) {
  const text = element.textContent || "";
  element.textContent = "";
  element.style.visibility = "visible";

  const words = text.split(" ").filter(Boolean);
  const innerSpans: HTMLElement[] = [];

  words.forEach((word, i) => {
    const wrapper = document.createElement("span");
    wrapper.style.display = "inline-block";
    wrapper.style.overflow = "hidden";
    wrapper.style.verticalAlign = "top";

    const inner = document.createElement("span");
    inner.textContent = word;
    inner.style.display = "inline-block";
    inner.style.transform = "translateY(110%)";

    wrapper.appendChild(inner);
    element.appendChild(wrapper);
    innerSpans.push(inner);

    if (i < words.length - 1) {
      const space = document.createElement("span");
      space.innerHTML = "&nbsp;";
      space.style.display = "inline-block";
      element.appendChild(space);
    }
  });

  return gsap.to(innerSpans, {
    y: "0%",
    duration: 0.7,
    stagger: 0.03,
    ease: "power3.out",
  });
}

export function parallaxScroll(element: gsap.TweenTarget, speed = 0.5) {
  return gsap.to(element, {
    y: () => speed * 100,
    ease: "none",
    scrollTrigger: {
      trigger: element as gsap.DOMTarget,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
}
