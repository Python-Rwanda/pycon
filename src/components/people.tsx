import Image from "@/components/Img";
import type { Member, Speaker, Sponsor } from "@/lib/types";

export const speakerId = (name: string) => name.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");

const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

function Avatar({ name, photo, size }: { name: string; photo?: string; size: number | string }) {
  return (
    <div style={{ position: "relative", width: size, aspectRatio: "1", borderRadius: 18, overflow: "hidden", background: "radial-gradient(100% 80% at 80% 0%, oklch(0.45 0.13 250), oklch(0.2 0.06 255))", flex: "none" }}>
      {photo ? (
        <Image src={photo} alt={name} fill sizes="320px" style={{ objectFit: "cover" }} />
      ) : (
        <div aria-hidden className="mono" style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: 28, color: "var(--ink-2)" }}>{initials(name)}</div>
      )}
    </div>
  );
}

export function SpeakerCard({ s, full = false }: { s: Speaker; full?: boolean }) {
  return (
    <article id={speakerId(s.name)} data-reveal className="card" style={{ padding: 16, scrollMarginTop: 110 }}>
      <Avatar name={s.name} photo={s.photo} size="100%" />
      <div style={{ padding: "16px 6px 6px" }}>
        {s.keynote && <span className="mono" style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--yellow)" }}>Keynote</span>}
        <h3 style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 800, letterSpacing: "-.02em" }}>{s.name}</h3>
        <p style={{ margin: "4px 0 0", fontSize: 15, color: "var(--ink-3)", lineHeight: 1.4 }}>{s.role}{s.country ? ` · ${s.country}` : ""}</p>
        {full && s.bio && <p style={{ margin: "12px 0 0", fontSize: 15, color: "var(--ink-2)", lineHeight: 1.6 }}>{s.bio}</p>}
        {full && s.links.length > 0 && (
          <div className="mono" style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 12, fontSize: 13 }}>
            {s.links.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noopener">{l.label} ↗</a>)}
          </div>
        )}
      </div>
    </article>
  );
}

export function SpeakerGrid({ speakers, full }: { speakers: Speaker[]; full?: boolean }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,240px),1fr))", gap: 16 }}>
      {speakers.map((s) => <SpeakerCard key={s.name} s={s} full={full} />)}
    </div>
  );
}

export function MemberGrid({ team }: { team: Member[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,200px),1fr))", gap: 16 }}>
      {team.map((m) => (
        <div key={m.name} data-reveal style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <Avatar name={m.name} photo={m.photo} size={72} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 17 }}>{m.linkedin ? <a href={m.linkedin} target="_blank" rel="noopener" style={{ color: "var(--ink)" }}>{m.name}</a> : m.name}</div>
            <div style={{ fontSize: 14, color: "var(--ink-3)", marginTop: 2 }}>{m.role}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SponsorTile({ p, big }: { p: Sponsor; big: boolean }) {
  const inner = p.logo ? (
    <Image src={p.logo} alt={p.name} width={240} height={96} style={{ height: big ? 64 : 44, width: "auto", maxWidth: "100%", objectFit: "contain" }} />
  ) : (
    <span style={{ fontSize: big ? 26 : 19, fontWeight: 800, letterSpacing: "-.01em" }}>{p.name}</span>
  );
  const style: React.CSSProperties = { display: "grid", placeItems: "center", textAlign: "center", minHeight: big ? 150 : 110, padding: "0 24px", borderRadius: 18, border: "1px solid var(--line)", background: "oklch(1 0 0 / .03)", color: "var(--ink)" };
  return p.url ? <a href={p.url} target="_blank" rel="noopener" style={style}>{inner}</a> : <div style={style}>{inner}</div>;
}

/** Sponsors grouped by tier, in the order the tiers are listed in edition.yaml. */
export function SponsorWall({ sponsors, tiers }: { sponsors: Sponsor[]; tiers: string[] }) {
  const order = [...tiers, ...new Set(sponsors.map((s) => s.tier).filter((t) => !tiers.includes(t)))];
  return (
    <div style={{ display: "grid", gap: 40 }}>
      {order.map((tier, i) => {
        const list = sponsors.filter((s) => s.tier === tier);
        if (!list.length) return null;
        return (
          <div key={tier}>
            <div className="mono" style={{ fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 14 }}>{tier}</div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill,minmax(min(100%,${i === 0 ? 300 : 200}px),1fr))`, gap: 14 }}>
              {list.map((p) => <SponsorTile key={p.name} p={p} big={i === 0} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
