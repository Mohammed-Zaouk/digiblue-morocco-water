import { useEffect, useRef, useState, type CSSProperties } from "react";

import "../styles/sections/Source.css";

const FILM = {
  video: "/media/videos/water-intro.mp4",
  poster: "/media/images/water-intro-poster.jpg",
  label: "A donkey carrying water containers back from the source",
  caption: "The daily trip back from the spring, containers loaded.",
};

const MOMENTS = {
  spring: {
    src: "/media/images/water-intro-poster.jpg",
    alt: "The water source outside the village",
    caption: "The spring, a long walk from the nearest house.",
  },
  hands: {
    src: "/media/images/water-intro-poster.jpg",
    alt: "Hands filling containers with water",
    caption: "Every container is filled by hand.",
  },
};

const LEDE =
  "For many rural families, water does not come from a tap. It is carried home from the source, one container at a time, and every trip costs time and strength.";

const FACTS = {
  access: {
    rural: 58.4, // % of rural Moroccans using safely managed drinking water
    national: 80, // % of all Moroccans (79.98 in the data)
    source: "WHO/UNICEF Joint Monitoring Programme, 2024 estimates",
  },
  fetching: {
    hours: 3, // reported estimates range from 3 to 3.5 hours a day
    source:
      "High Atlas Foundation; field study by S. Strohminger (University of Florida). Remote villages, not Taza specifically",
  },
  scarcity: {
    then: 645, // m3 per person per year, 2015
    now: 500, // projected for 2050
    line: 1000, // water-poverty line used by Bank Al-Maghrib
    source: "Bank Al-Maghrib annual report",
  },
};

const DROPS = 10;
const DROPS_FILLED = Math.round((FACTS.access.rural / 100) * DROPS);

type BarProps = {
  label: string;
  percent: number; // 0 to 100
  text: string;
  muted?: boolean;
};

function Bar({ label, percent, text, muted }: BarProps) {
  return (
    <div className={`source__bar${muted ? " source__bar--muted" : ""}`}>
      <span className="source__bar-label">{label}</span>
      <span className="source__track">
        <span
          className="source__fill"
          style={{ "--value": percent } as CSSProperties}
        />
      </span>
      <span className="source__bar-value">{text}</span>
    </div>
  );
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function Source() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const factsRef = useRef<HTMLUListElement>(null);
  const [muted, setMuted] = useState(true);
  const [shown, setShown] = useState(false);
  const [reduced] = useState(prefersReducedMotion);

  // Play while on screen, pause when scrolled away (no autoplay with reduced motion)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(video);

    return () => observer.disconnect();
  }, [reduced]);

  // Fill the numbers in once they scroll into view (instantly with reduced motion)
  useEffect(() => {
    const list = factsRef.current;
    if (!list) return;
    if (reduced) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(list);

    return () => observer.disconnect();
  }, [reduced]);

  // React does not reliably update the muted attribute, so set the property
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  return (
    <div className="section__inner source">
      <p className="source__meta">
        <span>04 / 06</span>
        <span>The source</span>
      </p>

      <h2 className="source__title">
        Every drop is <span>carried home</span>
      </h2>

      <figure className="source__film">
        <div className="source__frame">
          <video
            ref={videoRef}
            className="source__video"
            src={FILM.video}
            poster={FILM.poster}
            aria-label={FILM.label}
            muted
            loop
            playsInline
            preload="metadata"
            controls={reduced}
          />

          {!reduced && (
            <button
              type="button"
              className="source__sound"
              onClick={() => setMuted((value) => !value)}
              aria-pressed={!muted}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 9.5v5h3.5L12 19V5L7.5 9.5z" />
                {muted ? (
                  <path
                    d="M16 9.5l5 5m0-5l-5 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M15.5 9a4 4 0 0 1 0 6m2.5-8.5a7.5 7.5 0 0 1 0 11"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                )}
              </svg>
              <span>{muted ? "Sound off" : "Sound on"}</span>
            </button>
          )}
        </div>

        <figcaption className="source__note">{FILM.caption}</figcaption>
      </figure>

      <p className="source__lede">{LEDE}</p>

      <ul
        ref={factsRef}
        className={`source__facts${shown ? " is-visible" : ""}`}
        aria-label="Water access in numbers"
      >
        <li className="source__fact">
          <p className="source__figure">
            {Math.round(FACTS.access.rural)}
            <span>%</span>
          </p>
          <p className="source__label">
            of rural Moroccans use safely managed drinking water. About 4 in 10
            still do not.
          </p>

          <div className="source__drops" aria-hidden="true">
            {Array.from({ length: DROPS }, (_, i) => (
              <svg
                key={i}
                viewBox="0 0 24 24"
                className={i < DROPS_FILLED ? "is-filled" : ""}
                style={{ "--i": i } as CSSProperties}
              >
                <path d="M12 2.5C12 2.5 5.5 10 5.5 14.5a6.5 6.5 0 0 0 13 0C18.5 10 12 2.5 12 2.5z" />
              </svg>
            ))}
          </div>

          <div className="source__bars">
            <Bar
              label="Rural"
              percent={FACTS.access.rural}
              text={`${Math.round(FACTS.access.rural)}%`}
            />
            <Bar
              label="National"
              percent={FACTS.access.national}
              text={`${FACTS.access.national}%`}
              muted
            />
          </div>

          <p className="source__origin">Source: {FACTS.access.source}</p>
        </li>

        <li className="source__fact">
          <p className="source__figure">
            {FACTS.fetching.hours}
            <span>+ hours</span>
          </p>
          <p className="source__label">
            a day: what women in remote villages are reported to spend fetching
            water.
          </p>

          <div className="source__hours" aria-hidden="true">
            {Array.from({ length: 24 }, (_, i) => (
              <span
                key={i}
                className={i < FACTS.fetching.hours ? "is-filled" : ""}
                style={{ "--i": i } as CSSProperties}
              />
            ))}
          </div>
          <p className="source__scale">Out of 24 hours</p>

          <p className="source__origin">Source: {FACTS.fetching.source}</p>
        </li>

        <li className="source__fact">
          <p className="source__figure">
            {FACTS.scarcity.now}
            <span>m³</span>
          </p>
          <p className="source__label">
            of water per person per year is where Morocco is heading by 2050,
            down from {FACTS.scarcity.then} in 2015.
          </p>

          <div className="source__bars source__bars--scale">
            <Bar
              label="2015"
              percent={(FACTS.scarcity.then / FACTS.scarcity.line) * 100}
              text={`${FACTS.scarcity.then}`}
              muted
            />
            <Bar
              label="2050 est."
              percent={(FACTS.scarcity.now / FACTS.scarcity.line) * 100}
              text={`${FACTS.scarcity.now}`}
            />
          </div>
          <p className="source__scale">
            Right edge: {FACTS.scarcity.line.toLocaleString("en-US")} m³, the
            water-poverty line
          </p>

          <p className="source__origin">Source: {FACTS.scarcity.source}</p>
        </li>
      </ul>

      <div className="source__moments">
        <figure className="source__photo source__photo--hands">
          <img
            src={MOMENTS.hands.src}
            alt={MOMENTS.hands.alt}
            width={1200}
            height={1500}
            loading="lazy"
            decoding="async"
          />
          <figcaption className="source__caption">
            {MOMENTS.hands.caption}
          </figcaption>
        </figure>

        <figure className="source__photo source__photo--spring">
          <img
            src={MOMENTS.spring.src}
            alt={MOMENTS.spring.alt}
            width={1600}
            height={1200}
            loading="lazy"
            decoding="async"
          />
          <figcaption className="source__caption">
            {MOMENTS.spring.caption}
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
