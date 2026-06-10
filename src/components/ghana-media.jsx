import Image from "next/image";

export function MediaFeatureGrid({ eyebrow, title, copy, items = [] }) {
  return (
    <section className="content-section">
      <div className="shell section-shell media-shell">
        <div className="section-intro media-intro">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          {title ? <h2>{title}</h2> : null}
          {copy ? <p>{copy}</p> : null}
        </div>
        <div className="media-feature-grid">
          {items.map((item, index) => (
            <article key={`${item.title}-${index}`} className="media-feature-card">
              <div className="media-frame tall">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
                />
              </div>
              <div className="media-card-copy">
                <p className="eyebrow">Visual {index + 1}</p>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MediaSpotlight({ eyebrow, title, copy, src, alt, reverse = false }) {
  return (
    <div className={`media-spotlight ${reverse ? "reverse" : ""}`}>
      <div className="media-spotlight-copy">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        {title ? <h3>{title}</h3> : null}
        {copy ? <p>{copy}</p> : null}
      </div>
      <div className="media-frame spotlight">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 900px) 100vw, 48vw"
        />
      </div>
    </div>
  );
}

export function VideoSpotlight({ eyebrow, title, copy, src, poster, alt, reverse = false }) {
  return (
    <div className={`media-spotlight ${reverse ? "reverse" : ""}`}>
      <div className="media-spotlight-copy">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        {title ? <h3>{title}</h3> : null}
        {copy ? <p>{copy}</p> : null}
      </div>
      <div className="media-frame spotlight video-frame">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={poster}
          aria-label={alt}
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
