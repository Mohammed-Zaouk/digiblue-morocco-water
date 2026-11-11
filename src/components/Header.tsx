import "../styles/Header.css";

export default function Header() {
  return (
    <header className="header">
      <a
        className="header__brand"
        href="#arrival"
        aria-label="A Journey for Water, return to the beginning"
      >
        <span className="header__icon">
          <img
            src="/favicon/android-chrome-192x192.png"
            alt=""
            aria-hidden="true"
          />
        </span>

        <span className="header__text">
          <span className="header__title">A Journey for Water</span>
          <span className="header__subtitle">A story from rural Morocco</span>
        </span>
      </a>
    </header>
  );
}
