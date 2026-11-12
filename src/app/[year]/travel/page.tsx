import type { Metadata } from "next";
import Image from "@/components/Img";
import { ComingSoon, Go, Md, PageHeader } from "@/components/ui";
import { loadEdition, pagePhoto } from "@/lib/content";

export const metadata: Metadata = { title: "Travel & venue" };

export default async function TravelPage(props: { params: Promise<{ year: string }> }) {
  const { e, c } = await loadEdition(props);
  const { venue, travel } = e;
  return (
    <>
      <PageHeader eyebrow={`${e.name} · Travel & venue`} title={`Welcome to ${e.city}.`} photo={pagePhoto(e, "travel")} intro={<Md html={travel.intro} />} />

      <section className="section" style={{ paddingTop: "clamp(32px,4vw,56px)" }}>
        <div style={{ position: "relative", overflow: "hidden", borderRadius: 24, border: "1px solid var(--line)", background: "var(--bg-2)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))" }}>
          <div style={{ padding: "clamp(28px,4vw,48px)" }}>
            <div className="eyebrow y">Venue</div>
            <h2 style={{ margin: 0, fontSize: "clamp(28px,3.4vw,46px)", fontWeight: 800, letterSpacing: "-.03em" }}>{venue.name}</h2>
            <p style={{ margin: "12px 0 0", fontSize: 17, color: "var(--ink-2)", lineHeight: 1.6 }}>{venue.address ?? `${e.city}, ${e.country}`}</p>
            <p className="mono" style={{ margin: "16px 0 0", fontSize: 14, color: "var(--blue)" }}>{e.dateLabel}</p>
            {venue.map_url && <Go href={venue.map_url} className="btn btn-y" style={{ marginTop: 24 }}>Open in Maps ↗</Go>}
          </div>
          {venue.photo && (
            <div style={{ position: "relative", minHeight: 260 }}>
              <Image src={venue.photo} alt={venue.name} fill sizes="(max-width: 700px) 100vw, 50vw" style={{ objectFit: "cover" }} />
            </div>
          )}
        </div>
      </section>

      {travel.sections.length > 0 && (
        <section className="section alt" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "clamp(32px,4vw,64px)" }}>
          {travel.sections.map((s) => (
            <div key={s.title} data-reveal>
              <h2 style={{ margin: "0 0 14px", fontSize: "clamp(24px,2.6vw,34px)", fontWeight: 800, letterSpacing: "-.02em" }}>{s.title}</h2>
              <Md html={s.body} />
            </div>
          ))}
        </section>
      )}

      <section className="section">
        <div className="eyebrow">Where to stay</div>
        <h2 className="h2" style={{ marginBottom: 32 }}>Accommodation</h2>
        {travel.hotels.length ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,280px),1fr))", gap: 14 }}>
            {travel.hotels.map((h) => (
              <div key={h.name} data-reveal style={{ padding: 24, borderRadius: 20, border: "1px solid var(--line)", background: "var(--bg-2)" }}>
                <div style={{ fontSize: 20, fontWeight: 800 }}>{h.name}</div>
                {h.note && <p style={{ margin: "8px 0 0", fontSize: 15, color: "var(--ink-2)", lineHeight: 1.5 }}>{h.note}</p>}
                {h.url && <Go href={h.url} className="mono" style={{ display: "inline-block", marginTop: 14, fontSize: 14 }}>Website ↗</Go>}
              </div>
            ))}
          </div>
        ) : (
          <ComingSoon title="Hotels coming soon." text="Places near the venue, with conference rates where possible." />
        )}
        <p style={{ color: "var(--ink-3)", fontSize: 15, marginTop: 24 }}>
          Questions? <a href={`mailto:${c.links.email}`}>{c.links.email}</a>
        </p>
      </section>
    </>
  );
}
