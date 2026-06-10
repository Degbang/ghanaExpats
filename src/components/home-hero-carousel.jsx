"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function HomeHeroCarousel({ eyebrow, title, copy, actions = [], slides = [], stats = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(interval);
  }, [slides.length]);

  const activeSlide = slides[activeIndex];

  return (
    <section className="immersive-hero">
      <div className="immersive-hero-media" aria-hidden="true">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`immersive-slide ${index === activeIndex ? "is-active" : ""}`}
          >
            {slide.type === "video" && index === activeIndex ? (
              <video
                className="immersive-video"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster={slide.poster}
              >
                <source src={slide.src} type="video/mp4" />
              </video>
            ) : (
              <div
                className="immersive-slide-poster"
                style={{ backgroundImage: `url(${slide.poster})` }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="immersive-hero-overlay" />
      <div className="shell immersive-hero-shell">
        <div className="immersive-hero-panel">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1>{title}</h1>
          {copy ? <p className="hero-copy">{copy}</p> : null}
          {actions.length > 0 ? (
            <div className="button-row">
              {actions.map((action, index) => (
                <Link
                  key={`${action.href}-${action.label}`}
                  href={action.href}
                  className={`button ${index === 0 ? "primary-button" : "secondary-button"}`}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          ) : null}
          {stats.length > 0 ? (
            <div className="hero-stat-row">
              {stats.map((stat) => (
                <div key={stat.label} className="hero-stat-card">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <aside className="hero-slide-rail">
          <p className="eyebrow">Live Ghana visuals</p>
          <div className="hero-slide-list">
            {slides.map((slide, index) => (
              <button
                key={`${slide.id}-button`}
                type="button"
                className={index === activeIndex ? "is-active" : ""}
                onClick={() => setActiveIndex(index)}
                aria-label={`Show slide ${index + 1}: ${slide.label}`}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{slide.label}</strong>
                  <small>{slide.caption}</small>
                </div>
              </button>
            ))}
          </div>
          {activeSlide ? (
            <p className="hero-slide-caption">{activeSlide.alt}</p>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
