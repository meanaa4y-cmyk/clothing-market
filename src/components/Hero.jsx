import { useEffect, useRef, useState } from "react";
import { HERO_SLIDES } from "../data/catalog";

export default function Hero({ onFilterLink }) {
  const [index, setIndex] = useState(0);
  const timer = useRef(null);

  const goTo = (i) => setIndex((i + HERO_SLIDES.length) % HERO_SLIDES.length);

  const resetTimer = () => {
    clearInterval(timer.current);
    timer.current = setInterval(() => setIndex((i) => (i + 1) % HERO_SLIDES.length), 4500);
  };

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timer.current);
  }, []);

  const handleNav = (delta) => {
    setIndex((i) => (i + delta + HERO_SLIDES.length) % HERO_SLIDES.length);
    resetTimer();
  };

  return (
    <section className="hero" id="heroSlides">
      {HERO_SLIDES.map((s, i) => (
        <div key={i} className={`hero-slide ${i === index ? "active" : ""}`}>
          <img src={s.img} alt={s.title} />
          <div className="hero-caption">
            <span className="eyebrow">{s.eyebrow}</span>
            <h1>{s.title}</h1>
            <a
              href="#products"
              className="btn btn-light"
              onClick={(e) => { e.preventDefault(); onFilterLink(s.filter, s.title); }}
            >
              Shop Now
            </a>
          </div>
        </div>
      ))}
      <button className="hero-arrow left" onClick={() => handleNav(-1)}>‹</button>
      <button className="hero-arrow right" onClick={() => handleNav(1)}>›</button>
      <div className="hero-dots">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            className={i === index ? "active" : ""}
            onClick={() => { goTo(i); resetTimer(); }}
          />
        ))}
      </div>
    </section>
  );
}
