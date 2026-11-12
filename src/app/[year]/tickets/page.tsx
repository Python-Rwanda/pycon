import type { Metadata } from "next";
import { Go, Md, PageHeader, WindowCta } from "@/components/ui";
import { loadEdition, pagePhoto } from "@/lib/content";

export const metadata: Metadata = { title: "Tickets" };

export default async function TicketsPage(props: { params: Promise<{ year: string }> }) {
  const { e, c } = await loadEdition(props);
  const { tickets } = e;
  const buy = tickets.status === "open" && tickets.url;
  return (
    <>
      <PageHeader eyebrow={`${e.name} · Tickets`} title="Tickets" photo={pagePhoto(e, "tickets")} intro={<Md html={tickets.intro} />}>
        <WindowCta w={tickets} label="Buy tickets" fallback={{ label: "Get notified", href: c.links.mailing_list ?? `mailto:${c.links.email}?subject=${encodeURIComponent(`${e.name} tickets`)}` }} />
      </PageHeader>

      <section className="section" style={{ paddingTop: "clamp(32px,4vw,56px)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))", gap: 16 }}>
          {tickets.tiers.map((t, k) => (
            <div key={t.name} className={`tier${k === 0 ? " featured" : ""}`} data-reveal style={{ ["--d" as string]: `${k * 0.06}s` }}>
              <div className="mono" style={{ fontSize: 13, color: "var(--yellow)", letterSpacing: ".1em", textTransform: "uppercase" }}>{t.name}</div>
              <div style={{ fontSize: "clamp(36px,4vw,52px)", fontWeight: 800, letterSpacing: "-.03em", margin: "14px 0 0" }}>{t.price}</div>
              {t.note && <p style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.5, margin: "8px 0 0" }}>{t.note}</p>}
              {t.includes.length > 0 && <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 0", display: "grid", gap: 8 }}>
                {t.includes.map((i) => (
                  <li key={i} style={{ display: "flex", gap: 10, fontSize: 15, color: "var(--ink-2)" }}><span aria-hidden style={{ color: "var(--green)" }}>✓</span>{i}</li>
                ))}
              </ul>}
              {buy && <Go href={tickets.url!} className={`btn ${k === 0 ? "btn-y" : "btn-ghost"}`} style={{ marginTop: "auto", paddingTop: 16, justifyContent: "center" }}>Buy {t.name.toLowerCase()} ticket ↗</Go>}
            </div>
          ))}
        </div>
        <Md html={tickets.note} style={{ marginTop: 32 }} />
        <p style={{ color: "var(--ink-3)", fontSize: 15, marginTop: 8 }}>
          Questions? <a href={`mailto:${c.links.email}`}>{c.links.email}</a>
        </p>
      </section>
    </>
  );
}
