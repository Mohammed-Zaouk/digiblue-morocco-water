import { useEffect, useState } from "react";
import { STOPS } from "./palette";
import "../styles/Dots.css";

export default function Dots() {
  const [activeSection, setActiveSection] = useState("arrival");
  const [showLabel, setShowLabel] = useState(true);

  // Observe sections and detect the active one
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 },
    );

    STOPS.forEach((stop) => {
      const section = document.getElementById(stop.id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Show the active label for 3 seconds
  useEffect(() => {
    setShowLabel(true);

    const timer = setTimeout(() => {
      setShowLabel(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [activeSection]);

  return (
    <nav className="dots__container" aria-label="Story navigation">
      {STOPS.map((stop) => {
        const isActive = activeSection === stop.id;

        return (
          <div key={stop.id} className="dot__container">
            <span
              className={`dot${isActive ? " active" : ""}`}
              aria-hidden="true"
            />

            <span
              className={`dot__label${showLabel && isActive ? " visible" : ""}`}
            >
              {stop.id}
            </span>
          </div>
        );
      })}
    </nav>
  );
}
