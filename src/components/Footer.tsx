import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__river" aria-hidden="true">
        <svg viewBox="0 0 100 80" fill="none">
          <path
            d="M50 0 C20 20 80 35 50 50 S30 70 50 80"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="footer__content">
        <p className="footer__eyebrow">A STORY FROM RURAL MOROCCO</p>

        <h2>
          Water is more than a resource.
          <br />
          <span>It's a part of life.</span>
        </h2>

        <p className="footer__message">
          For some, water is always within reach. For others, every drop begins
          with a journey. May this story remind us never to take the simplest
          things for granted.
        </p>

        <a className="footer__back" href="#arrival">
          <span aria-hidden="true">↑</span>
          Return to the beginning
        </a>
      </div>

      <div className="footer__bottom">
        <span>Made with care in Morocco</span>
        <span>A story about water, people, and everyday life.</span>
      </div>
    </footer>
  );
}
