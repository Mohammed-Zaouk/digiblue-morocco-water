import { useEffect, useRef, useState } from "react";

import LoopVideo from "../components/LoopVideo";

import "../styles/sections/Trip.css";

const STOPS = [
  {
    label: "Leaving Taza",
    text: "Every visit to my grandparents starts here, in Taza. They live out in the countryside, and the city is already behind us long before the road ends.",
  },
  {
    label: "36 km of road",
    text: "It takes 36 km to reach the rural area where they live. The road stops there, but their house is still a walk away.",
  },
  {
    label: "2 km on foot",
    text: "The last 2 km are on foot, across the mountains. Whatever we bring with us, we carry.",
  },
  {
    label: "The river",
    text: "On the way we walk through a small river. For most people here it is more than a crossing: it is where the laundry gets washed and where a lot of everyday work happens.",
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

    // Reads a number from CSS, so the behavior is tuned in Trip.css
    const readNumber = (name: string, fallback: number) => {
      const value = parseFloat(getComputedStyle(route).getPropertyValue(name));
      return Number.isNaN(value) ? fallback : value;
    };

    const update = () => {
      frame = 0;

      // --trip-trigger: where on the screen (0 = top, 1 = bottom) a stop
      //   becomes active.
      // --trip-wait: 1 means no stop is active until the first one reaches
      //   that line.
      const trigger = readNumber("--trip-trigger", 0.6);
      const waitForFirst = readNumber("--trip-wait", 0) === 1;

      const line = window.innerHeight * trigger;
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

      let current = waitForFirst ? -1 : 0;
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
              label="Clip of the journey from Taza to the village"
            />
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
