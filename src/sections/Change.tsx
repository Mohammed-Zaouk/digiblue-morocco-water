import { useEffect, useRef, useState, type CSSProperties } from "react";

import "../styles/sections/Change.css";

const FILM = {
  video: "/media/videos/water-intro.mp4",
  poster: "/media/images/water-intro-poster.jpg",
  label: "A hopeful moment: water reaching the village",
  caption: "A tap, a smile, a shorter walk.",
};

const PHOTO = {
  src: "/media/images/water-intro-poster.jpg",
  alt: "Water running from a tap in the village",
  caption: "Water, a few steps from the door.",
};

const LEAD = {
  title: "144",
  label:
    "douars in Taza and Taounate supplied through a project fed by the Asfalou dam, reaching roughly 50,000 people.",
  lede: "For families in these douars, a tap closer to home means fewer trips to carry water and more time for school, work and rest.",
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
  note: "Up about 20 points in seven years. Still, about 4 in 10 rural Moroccans are waiting.",
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [reduced] = useState(prefersReducedMotion);
  const [chartRef, chartShown] = useReveal<HTMLElement>(reduced);

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

  // React does not reliably update the muted attribute, so set the property
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

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
            <video
              ref={videoRef}
              className="change__video"
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
                className="change__sound"
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
