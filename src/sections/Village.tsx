import LoopVideo from "../components/LoopVideo";

import "../styles/sections/Village.css";

const FILM = {
  title: "Short documentary",
  author: "Mohammed Zaouk",
  role: "filmmaker",
  quote: "Here, the river is the laundry room, and a lot more than that.",
  video: "/media/videos/water-intro.mp4",
};

const MOMENTS = {
  home: {
    src: "/media/images/village-home.jpeg",
    alt: "My grandparents’ house in the village",
    caption: "My grandparents’ house.",
  },
  daily: {
    src: "/media/images/village-daily.jpg",
    alt: "A morning in the village",
    caption: "An ordinary morning.",
  },
};

const LEDE =
  "The film follows daily life in the village: the washing at the river, the everyday jobs, and the people who do them. Nothing here comes out of a tap, so water decides what gets done and when.";

// Subtitle file: public/media/subtitles/village-en.vtt
const SUBTITLES = [
  {
    lang: "en",
    label: "English",
    src: "/media/subtitles/village-en.vtt",
  },
];

export default function Village() {
  return (
    <div className="section__inner village">
      <p className="village__meta">
        <span>03 / 06</span>
        <span>The village</span>
      </p>

      <h2 className="village__title">
        The village, <span>day to day</span>
      </h2>

      <div className="village__interview">
        <figure className="village__player">
          <div className="village__frame">
            <LoopVideo
              variant="story"
              src={FILM.video}
              label="Short documentary about daily life in the village"
              subtitles={SUBTITLES}
            />
          </div>

          <figcaption className="village__note">
            {FILM.title} on daily life in the village. English subtitles.
          </figcaption>
        </figure>

        <div className="village__voice">
          <blockquote className="village__quote">
            <p>{FILM.quote}</p>
          </blockquote>
          <p className="village__cite">
            <strong>{FILM.author}</strong>, {FILM.role}
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