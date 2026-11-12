import type { Metadata } from "next";
import { SponsorWall } from "@/components/people";
import { Chips, Go, Md, PageHeader } from "@/components/ui";
import { getSponsors, loadEdition, pagePhoto } from "@/lib/content";

export const metadata: Metadata = { title: "Sponsors" };

export default async function SponsorsPage(props: { params: Promise<{ year: string }> }) {
  const { year, e, c } = await loadEdition(props);
  const sponsors = getSponsors(year);
  const { sponsorship } = e;
  const mail = `mailto:${c.links.email}?subject=${encodeURIComponent(`Sponsoring ${e.name}`)}`;
  return (
    <>
      <PageHeader eyebrow={`${e.name} · Sponsors`} title="Sponsor PyCon Rwanda." photo={pagePhoto(e, "sponsors")} intro={<Md html={sponsorship.intro} />}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
          <a href={mail} className="btn btn-y">Talk to us about sponsoring</a>
          {sponsorship.prospectus && <Go href={sponsorship.prospectus} className="btn btn-ghost">Download the prospectus ↓</Go>}
        </div>
      </PageHeader>

      {sponsors.length > 0 && (
        <section className="section" style={{ paddingTop: "clamp(32px,4vw,56px)" }}>
          <div className="eyebrow">Thank you</div>
          <h2 className="h2" style={{ marginBottom: 40 }}>{e.name} sponsors</h2>
          <SponsorWall sponsors={sponsors} tiers={sponsorship.tiers.map((t) => t.name)} />
        </section>
      )}

      {e.audience.length > 0 && (
        <section className="section alt" style={{ paddingTop: sponsors.length ? undefined : "clamp(48px,6vw,80px)" }}>
          <div className="eyebrow y">Who you reach</div>
          <Chips items={e.audience} />
        </section>
      )}

      {sponsorship.tiers.length > 0 && (
        <section className="section">
          <div className="eyebrow">Packages</div>
          <h2 className="h2" style={{ marginBottom: 40 }}>Ways to sponsor.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,250px),1fr))", gap: 16 }}>
            {sponsorship.tiers.map((t, k) => (
              <div key={t.name} className={`tier${k === 0 ? " featured" : ""}`} data-reveal style={{ ["--d" as string]: `${k * 0.06}s` }}>
                <div className="mono" style={{ fontSize: 13, color: "var(--yellow)", letterSpacing: ".1em", textTransform: "uppercase", display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span>{t.name}</span>{t.slots && <span style={{ color: "var(--ink-3)" }}>{t.slots}</span>}
                </div>
                <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-.02em", margin: "14px 0 18px" }}>{t.price}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
                  {t.benefits.map((b) => (
                    <li key={b} style={{ display: "flex", gap: 10, fontSize: 15, color: "var(--ink-2)", lineHeight: 1.45 }}><span aria-hidden style={{ color: "var(--green)" }}>✓</span>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p style={{ color: "var(--ink-3)", fontSize: 15, marginTop: 24 }}>
            Packages can be adapted.
          </p>
        </section>
      )}

      <section className="section alt" style={{ textAlign: "center" }}>
        <h2 className="h2" style={{ fontSize: "clamp(32px,4.5vw,64px)" }}>Let&apos;s talk.</h2>
        <p style={{ color: "var(--ink-2)", fontSize: 18, lineHeight: 1.6, maxWidth: 560, margin: "18px auto 28px" }}>
          WeTell us what you&apos;d like to achieve and we&apos;ll put together a package that fits.apos;ll find a package that fits.
        </p>
        <a href={mail} className="btn btn-y">{c.links.email}</a>
      </section>
    </>
  );
}
