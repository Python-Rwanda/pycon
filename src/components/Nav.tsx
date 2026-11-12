"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { href, PAGES } from "@/lib/pages";
import type { NavData } from "@/lib/types";
import { useScrollY } from "./hooks";
import { useYear } from "./useYear";
import Wordmark from "./Wordmark";

export default function Nav({ data }: { data: NavData }) {
  const y = useScrollY();
  const path = usePathname();
  const year = useYear(data.years, data.current);
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  const solid = y > 40 || open;
  const tickets = data.tickets[year];
  const old = year !== data.current;

  return (
    <nav
      aria-label="Main"
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: solid ? "oklch(0.15 0.025 255 / .85)" : "transparent",
        backdropFilter: solid ? "blur(14px) saturate(1.4)" : "none",
        borderBottom: `1px solid ${solid ? "oklch(1 0 0 / .08)" : "transparent"}`,
        transition: "background .3s, border-color .3s",
      }}
    >
      {old && (
        <div className="mono" style={{ background: "var(--yellow)", color: "var(--bg)", fontSize: 13, padding: "8px clamp(16px,4vw,48px)", textAlign: "center" }}>
          You&apos;re looking at {data.name} {year}.{" "}
          <Link href={href(data.current)} style={{ color: "var(--bg)", textDecoration: "underline" }}>Go to {data.name} {data.current} →</Link>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: `${solid ? 12 : 20}px clamp(16px,4vw,48px)`, transition: "padding .3s" }}>
        <Link href={href(year)} aria-label={`${data.name} ${year} home`}>
          <Wordmark name={data.name} year={year} size={20} />
        </Link>
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "clamp(12px,1.8vw,26px)", fontSize: 14 }}>
          {PAGES.filter((p) => "top" in p).map((p) => {
            const to = href(year, p.slug);
            const active = path === to || path.startsWith(to + "/");
            return (
              <Link key={p.slug} href={to} className="hide-sm" aria-current={active ? "page" : undefined}
                style={{ color: active ? "var(--yellow)" : undefined, borderBottom: `1px solid ${active ? "var(--yellow)" : "transparent"}`, paddingBottom: 2 }}>
                {"short" in p ? p.short : p.label}
              </Link>
            );
          })}
          <Link href={href(year, "tickets")} className="btn btn-y" style={{ padding: "9px 18px", fontSize: 14 }}>
            {tickets?.status === "open" ? "Get tickets" : "Tickets"}
          </Link>
          <button className="burger" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}
            style={{ width: 40, height: 40, borderRadius: 99, border: "1px solid oklch(1 0 0 / .25)", background: "transparent", color: "var(--ink)", fontSize: 18, cursor: "pointer" }}>
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>
      {open && (
        <div className="mobile-menu" style={{ gap: 2, padding: "0 clamp(16px,4vw,48px) 16px", maxHeight: "calc(100svh - 80px)", overflowY: "auto" }}>
          {PAGES.map((p) => (
            <Link key={p.slug} href={href(year, p.slug)} style={{ color: "var(--ink)", fontSize: 21, fontWeight: 800, padding: "10px 0", borderBottom: "1px solid oklch(1 0 0 / .08)" }}>{p.label}</Link>
          ))}
          <Link href="/code-of-conduct" style={{ color: "var(--ink-2)", fontSize: 16, padding: "12px 0" }}>Code of Conduct</Link>
        </div>
      )}
    </nav>
  );
}
