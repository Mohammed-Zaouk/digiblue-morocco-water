import { useEffect, useRef, useState, type CSSProperties } from "react";

import LoopVideo from "../components/LoopVideo";

import "../styles/sections/Change.css";

const FILM = {
  video: "/media/videos/water-intro.mp4",
  label: "Water running from a tap in the village",
  caption: "A tap, a smile, a shorter walk.",
};

const PHOTO = {
  src: "/media/images/change-moment.jpg",
  alt: "Water running from a tap in the village",
  caption: "A tap a few steps from the door.",
};

const LEAD = {
  title: "144",
  label:
    "douars in Taza and Taounate now get water from a project fed by the Asfalou dam. Around 50,000 people live in them.",
  lede: "Taza is where this trip started, so this project is close to home. When a tap reaches a douar, the walk to the spring gets shorter.",
  source:
    "Islamic Development Bank case study on rural water supply in Taza province",
};

const PROGRESS = {
  title: "Rural Moroccans with safely managed drinking water",
  items: [
    { label: "2017", value: 38.1, text: "38%" },
    { label: "2018", value: 41.0, text: "41%" },
    { label: "2019", value: 44.0, text: "44%" },
    { label: "2020", value: 47.0, text: "47%" },
    { label: "2021", value: 50.2, text: "50%" },
    { label: "2022", value: 53.5, text: "54%" },
    { label: "2023", value: 56.9, text: "57%" },
    { label: "2024", value: 58.4, text: "58%" },
  ],
  note: "That is about 20 points more in seven years, and about 4 in 10 people in rural Morocco still don’t have it.",
  source: "WHO/UNICEF Joint Monitoring Programme, via TheGlobalEconomy",
};

const OUTRO = "The gap is closing. It has not closed.";

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

export default function Change() {
  const [reduced] = useState(prefersReducedMotion);
  const [chartRef, chartShown] = useReveal<HTMLElement>(reduced);

  const summary = PROGRESS.items
    .map((item) => `${item.label} ${item.text}`)
    .join(", ");

  return (
    <div className="section__inner change">
      <p className="change__meta">
        <span>06 / 06</span>
        <span>The change</span>
      </p>

      <h2 className="change__title">
        The water is <span>coming closer</span>
      </h2>

      <div className="change__lead">
        <figure className="change__film">
          <div className="change__frame">
            <LoopVideo src={FILM.video} label={FILM.label} />
          </div>

          <figcaption className="change__note">{FILM.caption}</figcaption>
        </figure>

        <div className="change__headline">
          <p className="change__figure">{LEAD.title}</p>
          <p className="change__label">{LEAD.label}</p>
          <p className="change__lede">{LEAD.lede}</p>
          <p className="change__origin">Source: {LEAD.source}</p>
        </div>
      </div>

      <div className="change__moments">
        <section
          ref={chartRef}
          className={`change__card${chartShown ? " is-visible" : ""}`}
        >
          <h3 className="change__card-title">{PROGRESS.title}</h3>

          <div
            className="change__chart"
            role="img"
            aria-label={`${PROGRESS.title}: ${summary}`}
            style={{ "--n": PROGRESS.items.length } as CSSProperties}
          >
            <div className="change__plot">
              {PROGRESS.items.map((item, i) => (
                <div className="change__slot" key={item.label}>
                  <span
                    className={`change__bar${
                      i === PROGRESS.items.length - 1
                        ? " change__bar--last"
                        : ""
                    }`}
                    style={
                      {
                        "--h": `${item.value}%`,
                        "--i": i,
                      } as CSSProperties
                    }
                  >
                    <span className="change__value">{item.text}</span>
                  </span>
                </div>
              ))}
            </div>

            <div className="change__axis">
              {PROGRESS.items.map((item) => (
                <span key={item.label}>{item.label}</span>
              ))}
            </div>
          </div>

          <p className="change__card-note">{PROGRESS.note}</p>
          <p className="change__origin">Source: {PROGRESS.source}</p>
        </section>

        <figure className="change__photo">
          <img
            src={PHOTO.src}
            alt={PHOTO.alt}
            width={1200}
            height={1500}
            loading="lazy"
            decoding="async"
          />
          <figcaption className="change__caption">{PHOTO.caption}</figcaption>
        </figure>
      </div>

      <div className="change__outro">
        <p className="change__closing">{OUTRO}</p>
      </div>
    </div>
  );
}
