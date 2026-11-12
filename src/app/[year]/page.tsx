import Hero, { type Cta } from "@/components/Hero";
import Marquee from "@/components/Marquee";
import { SpeakerGrid, SponsorWall } from "@/components/people";
import { Band, CardGrid, Chips, Go, Md, StatusPill } from "@/components/ui";
import { getConference, getEdition, getSpeakers, getSponsors } from "@/lib/content";
import { href } from "@/lib/pages";
import type { Window } from "@/lib/types";

type Props = { params: Promise<{ year: string }> };

export default async function EditionHome({ params }: Props) {
  const year = Number((await params).year);
  const c = getConference();
  const e = getEdition(year);
  const keynotes = getSpeakers(year).filter((s) => s.keynote);
  const sponsors = getSponsors(year);
  const mail = `mailto:${c.links.email}`;

  // The hero buttons follow what's happening: tickets on sale, CfP open, or "stay updated".
  const ctas: Cta[] = [];
  if (e.past) ctas.push({ label: "See the programme", href: href(year, "schedule"), primary: true });
  else {
    if (e.tickets.status === "open") ctas.push({ label: "Get tickets", href: href(year, "tickets"), primary: true });
    if (e.cfp.status === "open") ctas.push({ label: "Submit a talk", href: href(year, "cfp"), primary: ctas.length === 0 });
    if (ctas.length === 0) ctas.push({ label: "Stay updated", href: c.links.mailing_list ?? c.links.linkedin ?? mail, primary: true });
    ctas.push({ label: "Become a sponsor", href: href(year, "sponsors") });
  }

  const windows: { title: string; text: string; w: Window; slug: string }[] = [
    { title: "Call for proposals", text: "Give a talk or workshop.", w: e.cfp, slug: "cfp" },
    { title: "Tickets", text: "Student, individual, corporate.", w: e.tickets, slug: "tickets" },
    { title: "Financial aid", text: "Help with tickets and travel.", w: e.financial_aid, slug: "financial-aid" },
  ];

  return (
    <>
      <Hero
        name={c.name}
        year={year}
        eyebrow={`${e.dateLabel} · ${e.city}, ${e.country}`}
        tagline={e.tagline}
        video={e.hero.video}
        poster={e.hero.poster}
        startsAt={e.past ? undefined : e.startsAt}
        ctas={ctas}
      />

      {/* What's open right now */}
      {!e.past && (
        <section style={{ padding: "0 var(--pad)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))", gap: 14 }}>
            {windows.map(({ title, text, w, slug }, k) => (
              <Go key={slug} href={href(year, slug)} style={{ display: "block", padding: 24, borderRadius: 20, border: "1px solid var(--line)", background: "var(--bg-2)", color: "var(--ink)" }}>
                <div data-reveal style={{ ["--d" as string]: `${k * 0.06}s` }}>
                  <StatusPill status={w.status} />
                  <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-.02em", marginTop: 16 }}>{title} <span style={{ color: "var(--yellow)" }}>→</span></div>
                  <div style={{ fontSize: 15, color: "var(--ink-2)", marginTop: 6, lineHeight: 1.5 }}>{text}</div>
                  <div className="mono" style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 14 }}>{w.label}</div>
                </div>
              </Go>
            ))}
          </div>
        </section>
      )}

      <section className="section" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,360px),1fr))", gap: "clamp(32px,6vw,96px)" }}>
        <div>
          <div className="eyebrow">About the conference</div>
          <h2 className="h2">Python, people and Kigali<span style={{ color: "var(--yellow)" }}>.</span></h2>
          <Md html={e.about} style={{ marginTop: 28 }} />
        </div>
        {e.audience.length > 0 && (
          <div>
            <div className="eyebrow y">Who comes</div>
            <Chips items={e.audience} />
          </div>
        )}
      </section>

      {e.formats.length > 0 && (
        <section className="section alt">
          <div className="eyebrow">What happens</div>
          <h2 className="h2" style={{ marginBottom: 40 }}>More than talks.</h2>
          <CardGrid items={e.formats.map((f) => ({ title: f.name, text: f.text }))} />
        </section>
      )}

      {e.key_dates.length > 0 && (
        <section className="section">
          <div className="eyebrow y">Key dates</div>
          <h2 className="h2" style={{ marginBottom: 48 }}>Mark your calendar.</h2>
          <ol className="timeline">
            {e.key_dates.map((k) => (
              <li key={k.label} className={k.done ? "done" : undefined} data-reveal>
                <div className="mono" style={{ fontSize: 14, color: k.done ? "var(--ink-3)" : "var(--blue)" }}>{k.when}</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginTop: 8, lineHeight: 1.3, textDecoration: k.done ? "line-through" : undefined, color: k.done ? "var(--ink-3)" : "var(--ink)" }}>{k.label}</div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {keynotes.length > 0 && (
        <section className="section alt">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 16, flexWrap: "wrap", marginBottom: 40 }}>
            <div>
              <div className="eyebrow">Keynotes</div>
              <h2 className="h2">Meet the speakers.</h2>
            </div>
            <Go href={href(year, "speakers")} className="mono">All speakers →</Go>
          </div>
          <SpeakerGrid speakers={keynotes} />
        </section>
      )}

      {e.photos.length > 0 && (
        <section style={{ padding: "clamp(56px,7vw,96px) 0" }}>
          <div style={{ padding: "0 var(--pad)", marginBottom: 24, display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "end" }}>
            <div>
              <div className="eyebrow">Organized by {c.organizer.name}</div>
              <h2 className="h2" style={{ fontSize: "clamp(30px,3.6vw,52px)" }}>Built by the community.</h2>
            </div>
            <a href={c.organizer.url} target="_blank" rel="noopener" className="mono">Meet {c.organizer.name} ↗</a>
          </div>
          <Marquee photos={e.photos.map((src, i) => ({ src, alt: `${c.organizer.name} community event, photo ${i + 1}` }))} />
        </section>
      )}

      <section className="section" style={{ paddingTop: e.photos.length ? 0 : undefined }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
          <div>
            <div className="eyebrow">Sponsors</div>
            <h2 className="h2">{sponsors.length ? "Made possible by" : "Sponsor PyCon Rwanda"}</h2>
          </div>
          <Go href={href(year, "sponsors")} className="mono">Become a sponsor →</Go>
        </div>
        {sponsors.length ? (
          <SponsorWall sponsors={sponsors} tiers={e.sponsorship.tiers.map((t) => t.name)} />
        ) : (
          <p style={{ fontSize: 18, color: "var(--ink-2)", lineHeight: 1.6, maxWidth: 640, margin: 0 }}>
            Reach Rwanda&apos;s Python community and keep tickets affordable.
          </p>
        )}
      </section>

      <Band image={e.page_images.band} title={`Come to ${e.city}.`} text={`${e.dateLabel} · ${e.venue.name}`}>
        <Go href={href(year, "travel")} className="btn btn-dark">Travel &amp; venue</Go>
        <Go href={href(year, "faq")} className="btn join-outline">FAQ</Go>
      </Band>
    </>
  );
}
