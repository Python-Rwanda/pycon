import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { getConference, getEdition, getYears } from "@/lib/content";
import { href } from "@/lib/pages";

export const metadata: Metadata = { title: "All editions" };

export default function EditionsPage() {
  const c = getConference();
  return (
    <>
      <PageHeader eyebrow={c.name} title="All editions" />
      <section className="section" style={{ paddingTop: "clamp(16px,2vw,32px)" }}>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {getYears().map((y) => {
            const e = getEdition(y);
            return (
              <li key={y}>
                <Link href={href(y)} className="up-row" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, alignItems: "baseline", padding: "24px 4px", borderBottom: "1px solid var(--line)", color: "var(--ink)" }}>
                  <span className="mono" style={{ fontSize: "clamp(28px,4vw,48px)", color: y === c.current_edition ? "var(--yellow)" : "var(--blue)" }}>{y}</span>
                  <span>
                    <span style={{ display: "block", fontSize: 22, fontWeight: 800 }}>{e.name}</span>
                    <span style={{ display: "block", fontSize: 15, color: "var(--ink-3)", marginTop: 4 }}>{e.dateLabel} · {e.city}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
