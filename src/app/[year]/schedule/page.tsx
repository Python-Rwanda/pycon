import type { Metadata } from "next";
import Link from "next/link";
import { speakerId } from "@/components/people";
import { ComingSoon, Go, PageHeader } from "@/components/ui";
import { getSchedule, getSpeakers, loadEdition, pagePhoto } from "@/lib/content";
import { href } from "@/lib/pages";
import type { Slot } from "@/lib/types";

export const metadata: Metadata = { title: "Schedule" };

const KIND: Record<Slot["kind"], string> = {
  keynote: "var(--yellow)", talk: "var(--blue)", workshop: "var(--green)", panel: "var(--blue)",
  lightning: "var(--yellow)", break: "var(--ink-3)", social: "var(--green)", other: "var(--ink-3)",
};

export default async function SchedulePage(props: { params: Promise<{ year: string }> }) {
  const { year, e } = await loadEdition(props);
  const days = getSchedule(year);
  const known = new Set(getSpeakers(year).map((s) => s.name));

  return (
    <>
      <PageHeader eyebrow={`${e.name} · Schedule`} title="Schedule" photo={pagePhoto(e, "schedule")}
        intro={`${e.dateLabel} · Kigali time (UTC+2)`}>
        {days.length > 1 && (
          <div className="mono" style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 28 }}>
            {days.map((d, i) => <a key={d.date} href={`#day-${i + 1}`} className="btn btn-ghost" style={{ padding: "10px 18px", fontSize: 14 }}>{d.label}</a>)}
          </div>
        )}
      </PageHeader>

      <section className="section" style={{ paddingTop: "clamp(32px,4vw,56px)", display: "grid", gap: 72 }}>
        {days.length === 0 && (
          <ComingSoon title="Programme coming soon." text="Published once talks are selected.">
            <Go href={href(year, "cfp")} className="btn btn-y" style={{ marginTop: 24 }}>Call for proposals</Go>
          </ComingSoon>
        )}
        {days.map((d, i) => (
          <div key={d.date} id={`day-${i + 1}`} style={{ scrollMarginTop: 100 }}>
            <div className="eyebrow y">{d.dateLabel}</div>
            <h2 className="h2" style={{ fontSize: "clamp(30px,3.6vw,52px)", marginBottom: 24 }}>{d.label}</h2>
            <div>
              {d.slots.map((s, k) => {
                const quiet = s.kind === "break";
                return (
                  <div key={k} className="sched-row" data-reveal>
                    <div className="mono" style={{ fontSize: 15, color: "var(--ink-2)", fontVariantNumeric: "tabular-nums" }}>
                      {s.time}{s.end && <span style={{ color: "var(--ink-3)" }}>–{s.end}</span>}
                    </div>
                    <div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                        {!quiet && <span className="mono" style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: KIND[s.kind] }}>{s.kind}</span>}
                        {s.room && <span className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>{s.room}</span>}
                      </div>
                      <div style={{ fontSize: quiet ? 17 : 21, fontWeight: quiet ? 500 : 800, letterSpacing: "-.01em", color: quiet ? "var(--ink-3)" : "var(--ink)", marginTop: quiet ? 0 : 4 }}>{s.title}</div>
                      {s.speakers.length > 0 && (
                        <div style={{ fontSize: 15, color: "var(--ink-2)", marginTop: 4 }}>
                          {s.speakers.map((n, j) => (
                            <span key={n}>
                              {j > 0 && ", "}
                              {known.has(n) ? <Link href={`${href(year, "speakers")}#${speakerId(n)}`}>{n}</Link> : n}
                            </span>
                          ))}
                        </div>
                      )}
                      {s.abstract && <p style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.6, color: "var(--ink-3)", maxWidth: 720 }}>{s.abstract}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
