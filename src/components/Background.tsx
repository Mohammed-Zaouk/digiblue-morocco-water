import { useLayoutEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STOPS } from "./palette";
import "../styles/Background.css";

gsap.registerPlugin(ScrollTrigger);

// Ambient layer: left/top are page percentages, delay/duration in seconds
const DROPS = [
  { left: 5, top: 6, size: 10, delay: 0, dur: 7 },
  { left: 94, top: 15, size: 8, delay: 2, dur: 9 },
  { left: 7, top: 29, size: 12, delay: 1, dur: 8 },
  { left: 93, top: 43, size: 9, delay: 3, dur: 10 },
  { left: 4, top: 56, size: 8, delay: 0.5, dur: 9 },
  { left: 95, top: 68, size: 11, delay: 2.5, dur: 8 },
  { left: 6, top: 81, size: 9, delay: 1.5, dur: 10 },
  { left: 94, top: 92, size: 10, delay: 4, dur: 7 },
];

const RIPPLES = [
  { left: 3, top: 38, size: 90, delay: 0 },
  { left: 88, top: 60, size: 110, delay: 2 },
  { left: 4, top: 86, size: 80, delay: 4 },
];

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
    <>
      <div className="life" aria-hidden="true">
        {RIPPLES.map((r, i) => (
          <span
            key={`ripple-${i}`}
            className="life__ripple"
            style={
              {
                left: `${r.left}%`,
                top: `${r.top}%`,
                width: r.size,
                height: r.size,
                animationDelay: `${r.delay}s`,
              } as CSSProperties
            }
          />
        ))}
        {DROPS.map((d, i) => (
          <span
            key={`drop-${i}`}
            className="life__drop"
            style={
              {
                left: `${d.left}%`,
                top: `${d.top}%`,
                width: d.size,
                height: d.size,
                animationDelay: `${d.delay}s`,
                animationDuration: `${d.dur}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <svg
        className="river"
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="river-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f5eee2" />
            <stop offset="0.55" stopColor="#ffffff" />
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
    </>
  );
}
