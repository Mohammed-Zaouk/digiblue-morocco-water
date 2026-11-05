import { useEffect, useRef, useState } from "react";

import LoopVideo from "../components/LoopVideo";

import "../styles/sections/Trip.css";

const STOPS = [
  {
    label: "Leaving the city",
    text: "The trip starts in Taza. Little by little, the city falls behind us.",
  },
  {
    label: "On the road",
    text: "Buildings give way to open land, and the road keeps winding away from town.",
  },
  {
    label: "Arriving",
    text: "At the end of the road is my grandparents’ home, and a question that starts every morning: where will today’s water come from?",
  },
];

export default function Trip() {
  const routeRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  // Scroll-driven route: fills the rail and marks the active stop
  useEffect(() => {
    const route = routeRef.current;
    if (!route) return;

    const dots = Array.from(route.querySelectorAll<HTMLElement>(".trip__dot"));
    if (dots.length < 2) return;

    let frame = 0;

    const update = () => {
      frame = 0;

      const line = window.innerHeight * 0.6;
      const routeTop = route.getBoundingClientRect().top;
      const centers = dots.map((dot) => {
        const rect = dot.getBoundingClientRect();
        return rect.top + rect.height / 2;
      });

      const first = centers[0];
      const last = centers[centers.length - 1];
      const progress = Math.min(
        1,
        Math.max(0, (line - first) / (last - first)),
      );

      route.style.setProperty("--rail-top", `${first - routeTop}px`);
      route.style.setProperty("--rail-height", `${last - first}px`);
      route.style.setProperty("--progress", progress.toFixed(3));

      let current = 0;
      centers.forEach((center, index) => {
        if (center < line) current = index;
      });
      setActive(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="section__inner trip">
      <p className="trip__meta">
        <span>02 / 06</span>
        <span>The trip</span>
      </p>

      <h2 className="trip__title">
        The road to <span>my grandparents’ village</span>
      </h2>

      <div className="trip__layout">
        <figure className="trip__media">
          <div className="trip__frame">
            <LoopVideo
              src="/media/videos/water-intro.mp4"
              poster="/media/images/water-intro-poster.jpg"
              label="Looping clip of the road toward the village"
            />

            <p className="trip__chip" aria-hidden="true">
              <span>{String(active + 1).padStart(2, "0")}</span>
              {STOPS[active].label}
            </p>
          </div>
        </figure>

        <ol className="trip__route" role="list" ref={routeRef}>
          {STOPS.map((stop, index) => (
            <li
              className="trip__stop"
              key={stop.label}
              data-state={
                index === active ? "active" : index < active ? "past" : "next"
              }
              aria-current={index === active ? "step" : undefined}
            >
              <span className="trip__dot" aria-hidden="true" />

              <div className="trip__stop-body">
                <p className="trip__stop-index">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(STOPS.length).padStart(2, "0")}
                </p>
                <h3 className="trip__stop-title">{stop.label}</h3>
                <p className="trip__stop-text">{stop.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
