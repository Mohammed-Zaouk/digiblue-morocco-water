import { useEffect, useRef, useState } from "react";

import "../styles/sections/Village.css";

const INTERVIEW = {
  speaker: "A villager",
  relation: "from the village",
  quote: "We plan the whole day around the water.",
  video: "/media/videos/water-intro.mp4",
  poster: "/media/images/water-intro-poster.jpg",
};

const MOMENTS = {
  home: {
    src: "/media/images/water-intro-poster.jpg",
    alt: "A family home in the village",
    caption: "The family home.",
  },
  daily: {
    src: "/media/images/water-intro-poster.jpg",
    alt: "A morning in the village",
    caption: "An ordinary morning.",
  },
};

const LEDE =
  "In the village, daily life follows the water: when it arrives, how far it has to be carried, and who goes to fetch it. The interview shows what that routine looks like from the inside.";

// Subtitle files: public/media/subtitles/village-{lang}.vtt
const SUBTITLES = [
  { lang: "en", label: "English" },
  { lang: "ar", label: "العربية" },
  { lang: "fr", label: "Français" },
];

export default function Village() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Play after the tap, pause when the video scrolls out of view
  useEffect(() => {
    const video = videoRef.current;
    if (!isPlaying || !video) return;

    void video.play().catch(() => {});

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) video.pause();
      },
      { threshold: 0.25 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [isPlaying]);

  return (
    <div className="section__inner village">
      <p className="village__meta">
        <span>03 / 06</span>
        <span>The village</span>
      </p>

      <h2 className="village__title">
        The village, <span>in their own words</span>
      </h2>

      <div className="village__interview">
        <figure className="village__player">
          <div className="village__frame">
            {isPlaying ? (
              <video
                ref={videoRef}
                className="village__video"
                src={INTERVIEW.video}
                poster={INTERVIEW.poster}
                aria-label={`Interview with ${INTERVIEW.speaker}`}
                controls
                playsInline
                preload="auto"
              >
                {SUBTITLES.map((track) => (
                  <track
                    key={track.lang}
                    kind="subtitles"
                    src={`/media/subtitles/village-${track.lang}.vtt`}
                    srcLang={track.lang}
                    label={track.label}
                    default={track.lang === "en"}
                  />
                ))}
              </video>
            ) : (
              <button
                type="button"
                className="village__start"
                onClick={() => setIsPlaying(true)}
                aria-label={`Play the interview with ${INTERVIEW.speaker}`}
              >
                <img
                  className="village__poster"
                  src={INTERVIEW.poster}
                  alt=""
                  width={800}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                />
                <span className="village__play" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M8 5.5v13l11-6.5z" />
                  </svg>
                </span>
              </button>
            )}
          </div>

          <figcaption className="village__note">
            Interview with {INTERVIEW.speaker}. Subtitles in English, Arabic and
            French.
          </figcaption>
        </figure>

        <div className="village__voice">
          <blockquote className="village__quote">
            <p>{INTERVIEW.quote}</p>
          </blockquote>
          <p className="village__cite">
            <strong>{INTERVIEW.speaker}</strong>, {INTERVIEW.relation}
          </p>
          <p className="village__lede">{LEDE}</p>
        </div>
      </div>

      <div className="village__moments">
        <figure className="village__photo village__photo--home">
          <img
            src={MOMENTS.home.src}
            alt={MOMENTS.home.alt}
            width={1600}
            height={1200}
            loading="lazy"
            decoding="async"
          />
          <figcaption className="village__caption">
            {MOMENTS.home.caption}
          </figcaption>
        </figure>

        <figure className="village__photo village__photo--daily">
          <img
            src={MOMENTS.daily.src}
            alt={MOMENTS.daily.alt}
            width={1200}
            height={1500}
            loading="lazy"
            decoding="async"
          />
          <figcaption className="village__caption">
            {MOMENTS.daily.caption}
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
