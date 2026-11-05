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

        <div className="footer__info">
          <a
            className="footer__back"
            href="#arrival"
            aria-label="Return to the beginning"
            title="Return to the beginning"
          >
            <span className="footer__arrow" aria-hidden="true">
              ↑
            </span>
          </a>

          <div className="footer__info-item">
            <p className="footer__label">CREATED FOR</p>
            <p className="footer__value">
              <a
                href="https://bonolab.com/digiblue/"
                target="_blank"
                rel="noreferrer"
              >
                DigiBlue
              </a>
              , an initiative by{" "}
              <a href="https://bonolab.com/" target="_blank" rel="noreferrer">
                BonoLab
              </a>
            </p>
          </div>

          <div className="footer__info-item">
            <p className="footer__label">STORY &amp; DEVELOPMENT</p>
            <p className="footer__value">
              <a href="https://zaouk.dev/" target="_blank" rel="noreferrer">
                Mohammed Zaouk
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <span>Made with care in Morocco</span>
        <span>
          Everyone filmed gave permission. Location data removed from images.
        </span>
      </div>
    </footer>
  );
}
