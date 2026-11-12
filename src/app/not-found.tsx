import Link from "next/link";
import { getConference } from "@/lib/content";
import { href } from "@/lib/pages";

export default function NotFound() {
  const c = getConference();
  return (
    <section className="section" style={{ minHeight: "70svh", display: "grid", alignContent: "center", paddingTop: 160 }}>
      <div className="mono" style={{ color: "var(--yellow)", fontSize: 16 }}>
        <span style={{ opacity: 0.55 }}>&gt;&gt;&gt; </span>raise PageNotFound(404)
      </div>
      <h1 className="h2" style={{ marginTop: 20 }}>This page doesn&apos;t exist.</h1>
      <p style={{ fontSize: 18, color: "var(--ink-2)", margin: "16px 0 28px" }}>It may have moved, or the link may be wrong.</p>
      <div><Link href={href(c.current_edition)} className="btn btn-y">Go to {c.name} {c.current_edition}</Link></div>
    </section>
  );
}
