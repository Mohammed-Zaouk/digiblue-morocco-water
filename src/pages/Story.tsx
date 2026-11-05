import Background from "../components/Background";
import Dots from "../components/DotNav";

import Arrival from "../sections/Arrival";
import Change from "../sections/Change";
import Drought from "../sections/Drought";
import Source from "../sections/Source";
import Trip from "../sections/Trip";
import Village from "../sections/Village";

import "../styles/story.css";

export default function Story() {
  return (
    <main className="story">
      <Background />
      <Dots />

      <section id="arrival" className="section section--arrival">
        <video
          className="hero__video"
          src="media/videos/water-intro.mp4"
          poster="media/videos/water-intro.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="hero__overlay" />
        <Arrival />
      </section>

      <section id="trip" className="section section--trip">
        <Trip />
      </section>

      <section id="village" className="section section--village">
        <Village />
      </section>

      <section id="source" className="section section--source">
        <Source />
      </section>

      <section id="drought" className="section section--drought">
        <Drought />
      </section>

      <section id="change" className="section section--change">
        <Change />
      </section>
    </main>
  );
}
