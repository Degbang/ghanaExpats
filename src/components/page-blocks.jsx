import Link from "next/link";
import { slugify } from "@/lib/utils";

function formatSectionLabel(label = "") {
  return label
    .split(/[\s/&-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

function SectionIntro({ section, titleOverride }) {
  const heading = titleOverride ?? section.fields["Section headline"] ?? section.fields.Headline;
  const copy = section.fields["Section intro"] ?? section.fields.Body;
  const secondary = section.fields["Secondary text"];

  if (!heading && !copy && !secondary && !section.title) return null;

  return (
    <div className="section-intro">
      <p className="eyebrow">{formatSectionLabel(section.title)}</p>
      {heading ? <h2>{heading}</h2> : null}
      {copy ? <p>{copy}</p> : null}
      {secondary ? <p className="secondary-copy">{secondary}</p> : null}
    </div>
  );
}

export function PageSection({ section, variant, actions = [], children, tone = "paper", titleOverride }) {
  return (
    <section className={`content-section tone-${tone}`}>
      <div className={`shell section-shell ${variant === "rich" ? "is-rich" : "is-standard"}`}>
        <SectionIntro section={section} titleOverride={titleOverride} />
        {children}
        {variant === "default" ? <LooseCopy section={section} /> : null}
        {actions.length > 0 ? (
          <div className="button-row">
            {actions.map((action) => (
              <Link key={`${action.href}-${action.label}`} href={action.href} className="button secondary-button">
                {action.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function CardGrid({ cards }) {
  return (
    <div className={`card-grid ${cards.length === 3 ? "is-three" : ""}`}>
      {cards.map((card) => (
        <article key={`${card.title}-${card.eyebrow}`} className="content-card">
          {card.eyebrow ? <p className="eyebrow">{card.eyebrow}</p> : null}
          <h3>{card.title}</h3>
          {card.copy ? <p>{card.copy}</p> : null}
          {card.note ? <p className="secondary-copy">{card.note}</p> : null}
          {card.href && card.linkLabel ? (
            <Link className="text-link" href={card.href}>
              {card.linkLabel}
            </Link>
          ) : null}
        </article>
      ))}
    </div>
  );
}

export function StepsGrid({ steps }) {
  return (
    <div className="steps-grid">
      {steps.map((step, index) => (
        <article key={`${step.title}-${index}`} className="step-card">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <h3>{step.title}</h3>
          <p>{step.copy}</p>
        </article>
      ))}
    </div>
  );
}

export function PillGrid({ items }) {
  return (
    <div className="pill-grid">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

export function DataTable({ headers, rows }) {
  return (
    <div className="table-shell">
      <table>
        <thead>
          <tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell) => <td key={`${cell}-${index}`}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LooseCopy({ section }) {
  const lines = section.loose.filter((line) => !line.startsWith("[") && !line.startsWith("DEVELOPER"));
  if (lines.length === 0) return null;
  const bulletLines = lines.filter((line) => line.startsWith("- "));
  const paragraphLines = lines.filter((line) => !line.startsWith("- "));
  return (
    <div className="copy-stack">
      {paragraphLines.map((line, index) => (
        line.startsWith("**") && line.endsWith("**")
          ? <p key={index} className="copy-strong">{line.replace(/\*\*/g, "")}</p>
          : <p key={index}>{line}</p>
      ))}
      {bulletLines.length > 0 ? (
        <ul className="styled-list">
          {bulletLines.map((line) => (
            <li key={line}>{line.replace(/^- /, "")}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function GenericDocSection({ section, tone = "paper", routeMap = {} }) {
  if (!section) return null;

  const inlineList = Object.values(section.fields).find((value) => typeof value === "string" && value.includes("·"));
  const cards = section.blocks
    .filter((block) => block.type === "card" || block.type === "panel")
    .map((block, index) => ({
      eyebrow: block.fields.Eyebrow || `Card ${index + 1}`,
      title: block.fields.Headline || block.title,
      copy: block.fields.Body || "",
      note: block.fields["Secondary text"] || "",
      href: linkFromLabel(block.fields.CTA || block.fields["CTA Button"] || "", routeMap),
      linkLabel: block.fields.CTA || block.fields["CTA Button"] || ""
    }));
  const steps = section.blocks
    .filter((block) => block.type === "step")
    .map((block) => ({
      title: block.fields.Headline || block.title,
      copy: block.fields.Body || ""
    }));
  const rows = section.blocks
    .filter((block) => block.type === "row")
    .map((block) =>
      (Object.values(block.fields)[0] || "")
        .split("·")
        .map((cell) => cell.trim())
        .filter(Boolean)
    );

  return (
    <PageSection
      section={section}
      tone={tone}
      variant={cards.length > 0 || steps.length > 0 || rows.length > 0 || inlineList ? "rich" : "default"}
      actions={extractActions(section.fields, routeMap)}
    >
      {cards.length > 0 ? <CardGrid cards={cards} /> : null}
      {steps.length > 0 ? <StepsGrid steps={steps} /> : null}
      {rows.length > 0 ? (
        <DataTable
          headers={(section.fields["Table headers"] || "Label · Value").split("·").map((item) => item.trim())}
          rows={rows}
        />
      ) : null}
      {cards.length === 0 && steps.length === 0 && rows.length === 0 && inlineList ? (
        <PillGrid items={inlineList.split("·").map((item) => item.trim())} />
      ) : null}
    </PageSection>
  );
}

export function extractActions(fields = {}, routeMap = {}) {
  return Object.entries(fields)
    .filter(([key, value]) => key.includes("CTA") && value)
    .map(([, value]) => ({
      label: value,
      href: linkFromLabel(value, routeMap)
    }));
}

export function linkFromLabel(label = "", routeMap = {}) {
  const cleaned = label.toLowerCase();
  if (routeMap[label]) return routeMap[label];
  if (cleaned.includes("directory")) return "/directory";
  if (cleaned.includes("guide")) return "/guides";
  if (cleaned.includes("community") || cleaned.includes("facebook")) return "/join";
  if (cleaned.includes("emergency") || cleaned.includes("ambulance") || cleaned.includes("water tanker") || cleaned.includes("tow")) return "/emergency-response";
  if (cleaned.includes("property") || cleaned.includes("short-stay")) return "/real-estate";
  if (cleaned.includes("snug haven")) return "/snug-haven";
  if (cleaned.includes("diaspora")) return "/diaspora-programme";
  if (cleaned.includes("seller")) return "/register";
  if (cleaned.includes("vendor")) return "/register";
  if (cleaned.includes("contact")) return "/contact";
  return "#";
}

export function buildGuideCards(section) {
  const cards = new Map();
  Object.entries(section.fields).forEach(([key, value]) => {
    const match = key.match(/^Guide card (\d+) (title|sub)$/i);
    if (!match) return;
    const card = cards.get(match[1]) ?? {};
    card[match[2].toLowerCase()] = value;
    cards.set(match[1], card);
  });
  return Array.from(cards.values()).map((card) => ({
    eyebrow: "Guide",
    title: card.title,
    copy: card.sub,
    href: `/guides/${slugify(card.title)}`,
    linkLabel: "Read guide"
  }));
}
