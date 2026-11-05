import "../styles/sections/Arrival.css";

export default function Arrival() {
  return (
    <div className="section__inner arrival">
      <p className="arrival__meta">
        <span>01 / 06</span>
        <span>ARRIVAL</span>
      </p>

      <div className="arrival__content">
        <p className="arrival__eyebrow">TAZA, MOROCCO</p>

        <h1 className="arrival__hook">
          In my grandparents’ village, fresh water is a journey away.
        </h1>
      </div>

      <div className="arrival__bar">
        <a className="arrival__scroll" href="#trip">
          <span className="arrival__arrow" aria-hidden="true">
            ↓
          </span>
          Scroll to follow the water
        </a>
        <span className="arrival__tag">A DigiBlue visual story</span>
      </div>
    </div>
  );
}
