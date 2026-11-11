import { useEffect, useRef, useState } from "react";

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
  const frameRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Scroll-driven route: fills the rail and marks the active stop
  useEffect(() => {
    const route = routeRef.current;
    if (!route) return;

    const dots = Array.from(route.querySelectorAll<HTMLElement>(".trip__dot"));

    if (dots.length < 2) return;

    let frame = 0;

    const readNumber = (name: string, fallback: number) => {
      const value = parseFloat(getComputedStyle(route).getPropertyValue(name));

      return Number.isNaN(value) ? fallback : value;
    };

    const update = () => {
      frame = 0;

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

  // Keep fullscreen button synchronized with the browser
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === frameRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Toggle map fullscreen
  const toggleFullscreen = async () => {
    const frame = frameRef.current;
    if (!frame) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await frame.requestFullscreen();
      }
    } catch (error) {
      console.error("Unable to toggle fullscreen:", error);
    }
  };

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
          <div className="trip__frame" ref={frameRef}>
            <img
              className="trip__image"
              src="/media/images/trip-route.webp"
              alt="Illustrated map showing the journey from Taza to Traiba, with 36 kilometres by road and 2 kilometres on foot."
            />

            <button
              className="trip__fullscreen"
              type="button"
              onClick={toggleFullscreen}
              aria-label={
                isFullscreen ? "Exit fullscreen" : "View map fullscreen"
              }
              title={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
            >
              {isFullscreen ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M8 3v5H3" />
                  <path d="M16 3v5h5" />
                  <path d="M3 16h5v5" />
                  <path d="M21 16h-5v5" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                  <path d="M16 3h3a2 2 0 0 1 2 2v3" />
                  <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                  <path d="M21 16v3a2 2 0 0 1-2 2h-3" />
                </svg>
              )}
            </button>
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
