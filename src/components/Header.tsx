import "../styles/Header.css";

export default function Header() {
  return (
    <header className="header">
      <a className="header__brand" href="#arrival">
        <span className="header__icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9c3-3 6 3 9 0s6-3 9 0" />
            <path d="M3 15c3-3 6 3 9 0s6-3 9 0" />
          </svg>
        </span>

        <span className="header__text">
          <span className="header__title">A Journey for Water</span>
          <span className="header__subtitle">A story from rural Morocco</span>
        </span>
      </a>
    </header>
  );
}
