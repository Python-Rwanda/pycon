import Image from "@/components/Img";
import Link from "next/link";
import type { Photo, Status, Window } from "@/lib/types";

/** Compact header for inner pages: dimmed photo, eyebrow, title, intro. */
export function PageHeader({ eyebrow, title, intro, photo, children }: { eyebrow: string; title: React.ReactNode; intro?: React.ReactNode; photo?: Photo; children?: React.ReactNode }) {
  return (
    <header style={{ position: "relative", overflow: "hidden", padding: "clamp(150px,16vw,210px) var(--pad) clamp(48px,6vw,80px)" }}>
      {photo && <Image src={photo.src} alt="" fill priority sizes="100vw" style={{ objectFit: "cover", objectPosition: photo.pos ?? "50% 50%" }} />}
      <div aria-hidden style={{ position: "absolute", inset: 0, background: photo ? "linear-gradient(180deg, oklch(0.15 0.025 255 / .7), oklch(0.15 0.025 255 / .84) 60%, var(--bg))" : "radial-gradient(80% 120% at 20% 0%, oklch(0.3 0.08 250), var(--bg))" }} />
      <div style={{ position: "relative", maxWidth: 900 }}>
        <div className="eyebrow y">{eyebrow}</div>
        <h1 style={{ margin: 0, fontSize: "clamp(40px,7vw,104px)", lineHeight: 0.95, letterSpacing: "-.04em", fontWeight: 800, textWrap: "balance" }}>{title}</h1>
        {intro && <div style={{ fontSize: "clamp(17px,1.6vw,21px)", lineHeight: 1.55, color: "var(--ink-2)", margin: "24px 0 0", maxWidth: 640 }}>{intro}</div>}
        {children}
      </div>
    </header>
  );
}

/** Rendered Markdown from content/. */
export function Md({ html, className = "", style }: { html: string; className?: string; style?: React.CSSProperties }) {
  if (!html) return null;
  return <div className={`prose ${className}`} style={style} dangerouslySetInnerHTML={{ __html: html }} />;
}

const PILL: Record<Status, [string, string]> = {
  open: ["var(--green)", "Open"],
  soon: ["var(--blue)", "Opening soon"],
  closed: ["var(--ink-3)", "Closed"],
  tba: ["var(--ink-3)", "Coming soon"],
};

export function StatusPill({ status }: { status: Status }) {
  const [c, label] = PILL[status];
  return (
    <span className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", color: c, border: `1px solid ${c}`, borderRadius: 99, padding: "5px 12px" }}>
      <span aria-hidden style={{ width: 7, height: 7, borderRadius: 99, background: c, animation: status === "open" ? "pulse 1.6s infinite" : undefined }} />
      {label}
    </span>
  );
}

/** A link that opens external URLs in a new tab and uses client navigation for internal ones. */
export function Go({ href, className, style, children }: { href: string; className?: string; style?: React.CSSProperties; children: React.ReactNode }) {
  if (href.startsWith("/") && !href.startsWith("/media/")) return <Link href={href} className={className} style={style}>{children}</Link>;
  return <a href={href} className={className} style={style} target={href.startsWith("mailto") ? undefined : "_blank"} rel="noopener">{children}</a>;
}

/** The call-to-action for a window: the link while open, otherwise its status. */
export function WindowCta({ w, label, fallback }: { w: Window; label: string; fallback?: { label: string; href: string } }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16, marginTop: 28 }}>
      {w.status === "open" && w.url ? (
        <Go href={w.url} className="btn btn-y">{label} ↗</Go>
      ) : fallback ? (
        <Go href={fallback.href} className="btn btn-ghost">{fallback.label}</Go>
      ) : null}
      <StatusPill status={w.status} />
      <span className="mono" style={{ fontSize: 14, color: "var(--ink-2)" }}>{w.label}</span>
    </div>
  );
}

/** Placeholder for sections that aren't announced yet. */
export function ComingSoon({ title, text, children }: { title: string; text: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div data-reveal style={{ position: "relative", overflow: "hidden", borderRadius: 24, border: "1px dashed oklch(1 0 0 / .2)", padding: "clamp(28px,4vw,56px)", background: "var(--bg-2)" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(oklch(1 0 0 / .04) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / .04) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
      <div style={{ position: "relative" }}>
        <div className="mono" style={{ fontSize: 15, color: "var(--yellow)" }}><span style={{ opacity: 0.55 }}>&gt;&gt;&gt; </span>print(&quot;coming soon&quot;)</div>
        <h2 style={{ margin: "16px 0 0", fontSize: "clamp(26px,3vw,40px)", fontWeight: 800, letterSpacing: "-.02em" }}>{title}</h2>
        <div style={{ margin: "12px 0 0", fontSize: 17, lineHeight: 1.6, color: "var(--ink-2)", maxWidth: 620 }}>{text}</div>
        {children}
      </div>
    </div>
  );
}

/** Blue call-to-action band used at the bottom of pages. */
export function Band({ image, title, text, children }: { image?: string; title: string; text?: string; children?: React.ReactNode }) {
  return (
    <section style={{ position: "relative", overflow: "hidden", padding: "clamp(64px,8vw,110px) var(--pad)", color: "var(--bg)" }}>
      {image && <Image src={image} alt="" fill sizes="100vw" style={{ objectFit: "cover", filter: "grayscale(1)" }} />}
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "oklch(0.72 0.13 250 / .9)" }} />
      <div style={{ position: "relative", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "end", gap: 32 }}>
        <div style={{ maxWidth: 680 }}>
          <h2 style={{ margin: 0, fontSize: "clamp(40px,6vw,84px)", lineHeight: 0.95, letterSpacing: "-.04em", fontWeight: 800 }}>{title}</h2>
          {text && <p style={{ fontSize: 18, lineHeight: 1.5, margin: "20px 0 0" }}>{text}</p>}
        </div>
        <div className="band-ctas" style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>{children}</div>
      </div>
    </section>
  );
}

/** Numbered cards in a responsive grid. */
export function CardGrid({ items, min = 280 }: { items: { title: string; text: string; meta?: string }[]; min?: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit,minmax(min(100%,${min}px),1fr))`, gap: 14 }}>
      {items.map((it, k) => (
        <div key={it.title} data-reveal style={{ ["--d" as string]: `${k * 0.05}s`, padding: "24px 24px 26px", borderRadius: 20, border: "1px solid var(--line)", background: "var(--bg-2)" }}>
          <div className="mono" style={{ fontSize: 13, color: "var(--yellow)", display: "flex", justifyContent: "space-between", gap: 12 }}>
            <span>{String(k + 1).padStart(2, "0")}</span>
            {it.meta && <span style={{ color: "var(--blue)" }}>{it.meta}</span>}
          </div>
          <h3 style={{ margin: "12px 0 0", fontSize: 22, fontWeight: 800, letterSpacing: "-.02em" }}>{it.title}</h3>
          <p style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.6, color: "var(--ink-2)" }}>{it.text}</p>
        </div>
      ))}
    </div>
  );
}

/** Short items as tags. */
export function Chips({ items }: { items: string[] }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: 10 }}>
      {items.map((t) => (
        <li key={t} style={{ padding: "9px 16px", borderRadius: 99, border: "1px solid var(--line)", background: "oklch(1 0 0 / .04)", fontSize: 15, color: "var(--ink-2)" }}>{t}</li>
      ))}
    </ul>
  );
}

/** Numbered steps, one short line each. */
export function Steps({ steps }: { steps: { title: string; text: string }[] }) {
  return (
    <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,200px),1fr))", gap: 28 }}>
      {steps.map((s, k) => (
        <li key={s.title} data-reveal style={{ ["--d" as string]: `${k * 0.06}s`, borderTop: "2px solid var(--blue)", paddingTop: 18 }}>
          <div className="mono" style={{ fontSize: 13, color: "var(--yellow)" }}>{String(k + 1).padStart(2, "0")}</div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-.01em", marginTop: 8 }}>{s.title}</div>
          <div style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.5, marginTop: 6 }}>{s.text}</div>
        </li>
      ))}
    </ol>
  );
}

/** Topic tiles: optional code line, name, one line of examples. */
export function Topics({ items }: { items: { name: string; text: string; code?: string }[] }) {
  return (
    <div className="topics">
      {items.map((t, k) => (
        <div key={t.name} data-reveal className="topic" style={{ ["--d" as string]: `${k * 0.04}s` }}>
          {t.code && <div className="mono" style={{ fontSize: 13, color: "var(--yellow)" }}><span style={{ opacity: 0.5 }}>&gt;&gt;&gt; </span>{t.code}</div>}
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-.01em", marginTop: t.code ? 14 : 0 }}>{t.name}</div>
          <div style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.5, marginTop: 6 }}>{t.text}</div>
        </div>
      ))}
    </div>
  );
}
