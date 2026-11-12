"use client";

import Link from "next/link";
import Countdown from "./Countdown";
import { useScrollY } from "./hooks";

export type Cta = { label: string; href: string; primary?: boolean };

type HeroProps = {
  name: string;
  year: number;
  eyebrow: string;
  tagline: string;
  video?: string;
  poster?: string;
  startsAt?: string;
  ctas: Cta[];
};

const isExternal = (h: string) => /^(https?:|mailto:)/.test(h);

export default function Hero({ name, year, eyebrow, tagline, video, poster, startsAt, ctas }: HeroProps) {
  const y = useScrollY();
  const [first, ...rest] = name.split(" ");
  return (
    <header style={{ position: "relative", minHeight: "94svh", boxSizing: "border-box", padding: "140px var(--pad) 64px", overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
      {video && (
        <div style={{ position: "absolute", inset: "-10% 0 0", transform: `translateY(${y * 0.25}px)` }}>
          <video autoPlay muted loop playsInline preload="auto" poster={poster} style={{ width: "100%", height: "100%", objectFit: "cover" }}>
            <source src={video} type="video/mp4" />
          </video>
        </div>
      )}
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, oklch(0.15 0.025 255 / .55), oklch(0.15 0.025 255 / .72) 50%, var(--bg))" }} />
      {/* Big outlined year behind the title */}
      <div aria-hidden className="hero-year" style={{ position: "absolute", right: "var(--pad)", top: "16%", transform: `translateY(${y * -0.12}px)` }}>{year}</div>

      <div style={{ position: "relative", maxWidth: 980 }}>
        <div className="eyebrow y">{eyebrow}</div>
        <h1 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(56px,10.5vw,160px)", lineHeight: 0.88, letterSpacing: "-.04em" }}>
          {first} {rest.length > 0 && <span style={{ color: "var(--blue)" }}>{rest.join(" ")}</span>}
          <span style={{ color: "var(--yellow)" }}>.</span>
        </h1>
        <p style={{ maxWidth: 560, fontSize: "clamp(18px,1.8vw,22px)", lineHeight: 1.45, margin: "24px 0 0", color: "oklch(0.92 0.01 255)" }}>{tagline}</p>
        <Countdown iso={startsAt} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 32 }}>
          {ctas.map((c) =>
            isExternal(c.href) ? (
              <a key={c.label} href={c.href} target={c.href.startsWith("mailto") ? undefined : "_blank"} rel="noopener" className={`btn ${c.primary ? "btn-y" : "btn-ghost"}`}>{c.label}</a>
            ) : (
              <Link key={c.label} href={c.href} className={`btn ${c.primary ? "btn-y" : "btn-ghost"}`}>{c.label}</Link>
            ),
          )}
        </div>
      </div>
    </header>
  );
}
