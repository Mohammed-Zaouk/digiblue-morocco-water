import LoopVideo from "../components/LoopVideo";

import "../styles/sections/Village.css";

const FILM = {
  title: "Village life",
  author: "Mohammed Zaouk",
  role: "filmmaker",
  quote: "Here, the river is the laundry room, and a lot more than that.",
  video: "/media/videos/water-intro.mp4",
};

const MOMENTS = {
  home: {
    src: "/media/images/village-home.webp",
    alt: "My grandparents’ house in the village",
    caption: "My grandparents’ house.",
  },
  daily: {
    src: "/media/images/village-daily.webp",
    alt: "A morning in the village",
    caption: "An ordinary morning.",
  },
};

const LEDE =
  "Daily life in the village runs on the river: the washing, the everyday jobs, and the people who do them. Nothing here comes out of a tap, so water decides what gets done and when.";

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
            <LoopVideo src={FILM.video} label="Daily life in the village" />
          </div>

          <figcaption className="village__note">
            {FILM.title}: the river, the washing and the daily work.
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
