import { useEffect, useRef, useState, type CSSProperties } from "react";

import "../styles/sections/Drought.css";

const LEAD = {
  years: 6,
  label:
    "years in a row with below-average rainfall in Morocco, from 2019 to 2024.",
  source: "World Meteorological Organization, via Yabiladi",
  lede: "Villages that depend on springs and wells feel a drought first. The water runs lower, and the walk to find it gets longer.",
};

const MOMENTS = {
  ground: {
    src: "/media/images/drought-ground.jpg",
    alt: "Dry, cracked ground near the village",
    caption: "Dry ground outside the village.",
  },
  spring: {
    src: "/media/images/drought-spring.jpg",
    alt: "A low spring in a dry landscape",
    caption: "The spring, lower than anyone remembers.",
  },
};

const RAIN = {
  title: "Spring rainfall compared with average",
  min: -70,
  max: 45,
  items: [
    { label: "2023", value: -57.6, text: "−57.6%" },
    { label: "2024", value: -17.3, text: "−17.3%" },
    { label: "2025", value: 30.3, text: "+30.3%" },
    { label: "2026", value: -9.6, text: "−9.6%" },
  ],
  note: "A wetter 2025 interrupted the run, but spring 2026 was again below average.",
  source: "Morocco's General Directorate of Meteorology (DGM), via Yabiladi",
};

const DAMS = {
  title: "How full Morocco's dams were",
  min: 0,
  max: 100,
  items: [
    { label: "Jul 2022", value: 29.2, text: "29%" },
    { label: "Early 2024", value: 25, text: "25%" },
    { label: "Jan 2025", value: 28, text: "28%" },
    { label: "Jan 2026", value: 42.5, text: "43%" },
    { label: "Aug 2026", value: 67.5, text: "68%" },
  ],
  note: "National filling rate, measured at different times of the year: read the trend, not single bars.",
  source:
    "Ministry of Equipment and Water data, via Morocco World News, Greentimes and AFP",
};

const LOCAL = {
  title: "Closer to Taza",
  dams: [
    {
      name: "Bab Louta dam",
      role: "Drinking-water dam in Taza province",
      before: 69,
      after: 98,
    },
    {
      name: "Asfalou dam",
      role: "Serves 144 douars in Taza and Taounate",
      before: 36,
      after: 61,
    },
  ],
  note: "Filling rate on 24 December 2025 and on 1 June 2026.",
  source:
    "Ministry of Equipment and Water data, via Express TV and Morocco World News; Islamic Development Bank case study",
};

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// True once the element scrolls into view (immediately with reduced motion)
function useReveal<T extends Element>(reduced: boolean) {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(reduced);

  useEffect(() => {
    const element = ref.current;
    if (!element || reduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, [reduced]);

  return [ref, shown] as const;
}

type Column = { label: string; value: number; text: string };

// Vertical bars: negative values hang below the zero line
function ColumnChart({
  title,
  items,
  min,
  max,
}: {
  title: string;
  items: Column[];
  min: number;
  max: number;
}) {
  const span = max - min;
  const zero = (max / span) * 100;
  const summary = items.map((item) => `${item.label} ${item.text}`).join(", ");

  return (
    <div
      className="drought__chart"
      role="img"
      aria-label={`${title}: ${summary}`}
      style={{ "--n": items.length } as CSSProperties}
    >
      <div
        className="drought__plot"
        style={{ "--zero": `${zero}%` } as CSSProperties}
      >
        {min < 0 && <span className="drought__zero" />}
        {items.map((item, i) => (
          <div className="drought__slot" key={item.label}>
            <span
              className={`drought__bar ${
                item.value < 0 ? "drought__bar--neg" : "drought__bar--pos"
              }`}
              style={
                {
                  "--h": `${(Math.abs(item.value) / span) * 100}%`,
                  "--i": i,
                } as CSSProperties
              }
            >
              <span className="drought__value">{item.text}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="drought__axis">
        {items.map((item) => (
          <span key={item.label}>{item.label}</span>
        ))}
      </div>
    </div>
  );
}

type BarProps = {
  label: string;
  percent: number; // 0 to 100
  text: string;
  muted?: boolean;
};

function Bar({ label, percent, text, muted }: BarProps) {
  return (
    <div
      className={`drought__bar-row${muted ? " drought__bar-row--muted" : ""}`}
    >
      <span className="drought__bar-label">{label}</span>
      <span className="drought__track">
        <span
          className="drought__fill"
          style={{ "--value": percent } as CSSProperties}
        />
      </span>
      <span className="drought__bar-value">{text}</span>
    </div>
  );
}

export default function Drought() {
  const [reduced] = useState(prefersReducedMotion);
  const [chartsRef, chartsShown] = useReveal<HTMLDivElement>(reduced);
  const [localRef, localShown] = useReveal<HTMLDivElement>(reduced);

  return (
    <div className="section__inner drought">
      <p className="drought__meta">
        <span>05 / 06</span>
        <span>The drought</span>
      </p>

      <h2 className="drought__title">
        Six years of <span>too little rain</span>
      </h2>

      <div className="drought__lead">
        <div className="drought__headline">
          <p className="drought__figure">{LEAD.years}</p>
          <p className="drought__label">{LEAD.label}</p>
          <p className="drought__lede">{LEAD.lede}</p>
          <p className="drought__origin">Source: {LEAD.source}</p>
        </div>

        <figure className="drought__photo drought__photo--ground">
          <img
            src={MOMENTS.ground.src}
            alt={MOMENTS.ground.alt}
            width={1200}
            height={1500}
            loading="lazy"
            decoding="async"
          />
          <figcaption className="drought__caption">
            {MOMENTS.ground.caption}
          </figcaption>
        </figure>
      </div>

      <div
        ref={chartsRef}
        className={`drought__charts${chartsShown ? " is-visible" : ""}`}
      >
        <section className="drought__card">
          <h3 className="drought__card-title">{RAIN.title}</h3>
          <ColumnChart
            title={RAIN.title}
            items={RAIN.items}
            min={RAIN.min}
            max={RAIN.max}
          />
          <p className="drought__note">{RAIN.note}</p>
          <p className="drought__origin">Source: {RAIN.source}</p>
        </section>

        <section className="drought__card">
          <h3 className="drought__card-title">{DAMS.title}</h3>
          <ColumnChart
            title={DAMS.title}
            items={DAMS.items}
            min={DAMS.min}
            max={DAMS.max}
          />
          <p className="drought__note">{DAMS.note}</p>
          <p className="drought__origin">Source: {DAMS.source}</p>
        </section>
      </div>

      <div className="drought__local">
        <section
          ref={localRef}
          className={`drought__card drought__card--local${
            localShown ? " is-visible" : ""
          }`}
        >
          <h3 className="drought__card-title">{LOCAL.title}</h3>

          <div className="drought__dams">
            {LOCAL.dams.map((dam) => (
              <div className="drought__dam" key={dam.name}>
                <p className="drought__dam-name">{dam.name}</p>
                <p className="drought__dam-role">{dam.role}</p>
                <div className="drought__hbars">
                  <Bar
                    label="Dec 2025"
                    percent={dam.before}
                    text={`${dam.before}%`}
                    muted
                  />
                  <Bar
                    label="Jun 2026"
                    percent={dam.after}
                    text={`${dam.after}%`}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="drought__note">{LOCAL.note}</p>
          <p className="drought__origin">Source: {LOCAL.source}</p>
        </section>

        <figure className="drought__photo drought__photo--spring">
          <img
            src={MOMENTS.spring.src}
            alt={MOMENTS.spring.alt}
            width={1600}
            height={1200}
            loading="lazy"
            decoding="async"
          />
          <figcaption className="drought__caption">
            {MOMENTS.spring.caption}
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
