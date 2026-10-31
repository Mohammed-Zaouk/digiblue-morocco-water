import Background from "../components/Background";
import Dots from "../components/DotNav";
import "../styles/story.css";

export default function Home() {
  return (
    <main className="story">
      <Background />
      <Dots />

      <section id="arrival" className="section section--arrival">
        <video
          className="hero__video"
          src="/media/hero.webm"
          poster="/media/hero.jpg"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="hero__overlay" />
        <div className="section__inner"></div>
      </section>

      <section id="trip" className="section section--trip">
        <div className="section__inner"></div>
      </section>

      <section id="village" className="section section--village">
        <div className="section__inner"></div>
      </section>

      <section id="source" className="section section--source">
        <div className="section__inner"></div>
      </section>

      <section id="drought" className="section section--drought">
        <div className="section__inner"></div>
      </section>

      <section id="change" className="section section--change">
        <div className="section__inner"></div>
      </section>
    </main>
  );
}
