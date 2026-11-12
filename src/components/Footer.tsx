"use client";

import Link from "next/link";
import { href } from "@/lib/pages";
import type { NavData } from "@/lib/types";
import { useYear } from "./useYear";
import Wordmark from "./Wordmark";

type L = { href?: string; label: string };

export default function Footer({ data }: { data: NavData }) {
  const year = useYear(data.years, data.current);
  const { links } = data;
  const cols: { title: string; links: L[] }[] = [
    { title: "Conference", links: [
      { href: href(year), label: "Overview" }, { href: href(year, "speakers"), label: "Speakers" }, { href: href(year, "schedule"), label: "Schedule" },
      { href: href(year, "tickets"), label: "Tickets" }, { href: href(year, "travel"), label: "Travel & venue" }, { href: href(year, "faq"), label: "FAQ" },
    ] },
    { title: "Take part", links: [
      { href: href(year, "cfp"), label: "Call for proposals" }, { href: href(year, "financial-aid"), label: "Financial aid" },
      { href: href(year, "volunteer"), label: "Volunteer" }, { href: href(year, "sponsors"), label: "Sponsor" },
    ] },
    { title: "More", links: [
      { href: href(year, "about"), label: "About & team" }, { href: "/code-of-conduct", label: "Code of Conduct" },
      ...(data.years.length > 1 ? [{ href: "/editions", label: "All editions" }] : []),
      { href: links.community_site, label: data.organizer.name }, { href: `mailto:${links.email}`, label: links.email },
    ] },
    { title: "Follow", links: [
      { href: links.linkedin, label: "LinkedIn" }, { href: links.instagram, label: "Instagram" }, { href: links.x, label: "X" },
      { href: links.whatsapp, label: "WhatsApp" }, { href: links.mailing_list, label: "Newsletter" },
    ].filter((l) => l.href) },
  ];

  return (
    <footer style={{ borderTop: "1px solid var(--line)", padding: "clamp(48px,6vw,72px) var(--pad) 32px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 36 }}>
        <div>
          <Wordmark name={data.name} year={year} size={17} />
          <p style={{ color: "var(--ink-3)", fontSize: 14, lineHeight: 1.6, margin: "16px 0 0", maxWidth: 260 }}>
            Organized by volunteers from <a href={data.organizer.url} target="_blank" rel="noopener">{data.organizer.name}</a>.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <div className="mono" style={{ fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 14 }}>{c.title}</div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10, fontSize: 15 }}>
              {c.links.map((l) => (
                <li key={l.label}>
                  {l.href!.startsWith("/") ? (
                    <Link href={l.href!} style={{ color: "var(--ink-2)" }}>{l.label}</Link>
                  ) : (
                    <a href={l.href} target={l.href!.startsWith("mailto") ? undefined : "_blank"} rel="noopener" style={{ color: "var(--ink-2)", overflowWrap: "anywhere" }}>{l.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mono" style={{ marginTop: 48, fontSize: 12, color: "var(--ink-3)", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12 }}>
        <span>© {data.copyrightYear} {data.name} · {data.organizer.name}</span>
        <span>Python and PyCon are trademarks of the Python Software Foundation.</span>
      </div>
    </footer>
  );
}
