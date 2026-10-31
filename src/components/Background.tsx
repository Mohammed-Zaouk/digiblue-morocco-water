import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STOPS } from "./palette";
import "../styles/Background.css";

gsap.registerPlugin(ScrollTrigger);

export default function Background() {
  const riverRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const mm = gsap.matchMedia();

    mm.add(
      {
        animate: "(prefers-reduced-motion: no-preference)",
        reduce: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const { reduce } = ctx.conditions as { reduce: boolean };

        STOPS.forEach((stop, i) => {
          const section = document.getElementById(stop.id);
          if (!section) return;

          // Flip text color when this section is mostly in view
          ScrollTrigger.create({
            trigger: section,
            start: "top 50%",
            end: "bottom 50%",
            onToggle: (self) => {
              if (self.isActive) root.dataset.tone = stop.tone;
            },
          });

          if (i === 0) return;

          // Blend from the previous color as this section arrives
          gsap.fromTo(
            root,
            { "--bg": STOPS[i - 1].color },
            {
              "--bg": stop.color,
              ease: "none",
              immediateRender: false,
              duration: reduce ? 0.3 : 1,
              scrollTrigger: reduce
                ? {
                    trigger: section,
                    start: "top 50%",
                    toggleActions: "play none none reverse",
                  }
                : {
                    trigger: section,
                    start: "top 85%",
                    end: "top 35%",
                    scrub: true,
                  },
            },
          );
        });

        // River draws itself along the whole story
        if (riverRef.current) {
          if (reduce) {
            gsap.set(riverRef.current, { strokeDashoffset: 0 });
          } else {
            gsap.fromTo(
              riverRef.current,
              { strokeDashoffset: 1 },
              {
                strokeDashoffset: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: ".story",
                  start: "top top",
                  end: "bottom bottom",
                  scrub: true,
                },
              },
            );
          }
        }
      },
    );

    // Media loading changes page height, so recalculate trigger positions
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      mm.revert();
    };
  }, []);

  return (
    <svg
      className="river"
      viewBox="0 0 100 1000"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="river-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9a7448" />
          <stop offset="0.55" stopColor="#7aa7b8" />
          <stop offset="1" stopColor="#e8f6fb" />
        </linearGradient>
      </defs>
      <path
        ref={riverRef}
        className="river__path"
        pathLength={1}
        d="M50 0 C 80 120, 20 240, 50 360 S 80 600, 50 720 S 20 900, 50 1000"
        stroke="url(#river-gradient)"
      />
    </svg>
  );
}
