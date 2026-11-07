import { useEffect, useRef, useState, type CSSProperties } from "react";

import LoopVideo from "../components/LoopVideo";

import "../styles/sections/Source.css";

const FILM = {
  video: "/media/videos/source-film.mp4",
  label: "A donkey carrying full water containers back from the spring",
  caption: "The donkey takes the full containers back from the spring.",
};

// Used until the video reports its real size (9:16 portrait)
const DEFAULT_RATIO = 9 / 16;

const MOMENTS = {
  spring: {
    src: "/media/images/source-spring.jpg",
    alt: "The spring outside the village",
    caption: "The spring, a long walk from the nearest house.",
  },
  hands: {
    src: "/media/images/water-intro-poster.jpg",
    alt: "Hands filling containers with water",
    caption: "Filling the containers at the spring, one by one.",
  },
};

const LEDE =
  "The river in the village is for washing and everyday work. Drinking water comes from the spring, and someone has to bring it back, container by container.";

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
  const factsRef = useRef<HTMLUListElement>(null);
  const [shown, setShown] = useState(false);
  const [reduced] = useState(prefersReducedMotion);
  const [ratio, setRatio] = useState(DEFAULT_RATIO);

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

  return (
    <div className="section__inner source">
      <p className="source__meta">
        <span>04 / 06</span>
        <span>The source</span>
      </p>

      <h2 className="source__title">
        Every drop is <span>carried home</span>
      </h2>

      <div
        className="source__intro"
        style={{ "--ratio": ratio } as CSSProperties}
      >
        <figure className="source__film">
          <div className="source__frame">
            <LoopVideo
              src={FILM.video}
              label={FILM.label}
              fit="contain"
              onRatio={setRatio}
            />
          </div>

          <figcaption className="source__note">{FILM.caption}</figcaption>
        </figure>

        <p className="source__lede">{LEDE}</p>
      </div>

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
            of people in rural Morocco have safely managed drinking water. About
            4 in 10 do not.
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
            a day is what women in remote villages are reported to spend
            fetching water.
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
            of water per person per year is what Morocco is heading toward by
            2050, down from {FACTS.scarcity.then} in 2015.
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
