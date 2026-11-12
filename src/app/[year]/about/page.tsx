import type { Metadata } from "next";
import Link from "next/link";
import { MemberGrid } from "@/components/people";
import { Band, Go, Md, PageHeader } from "@/components/ui";
import { getTeam, loadEdition, pagePhoto } from "@/lib/content";
import { href } from "@/lib/pages";

export const metadata: Metadata = { title: "About & team" };

export default async function AboutPage(props: { params: Promise<{ year: string }> }) {
  const { year, e, c } = await loadEdition(props);
  const team = getTeam(year);
  return (
    <>
      <PageHeader eyebrow={`${e.name} · About`} title={`About ${c.name}`} photo={pagePhoto(e, "about")} />
      <section className="section" style={{ paddingTop: "clamp(32px,4vw,56px)" }}>
        <Md html={e.about} />
        <p style={{ fontSize: 18, lineHeight: 1.7, color: "var(--ink-2)", maxWidth: 680 }}>
          Everyone taking part agrees to the <Link href="/code-of-conduct">Code of Conduct</Link>.
        </p>
      </section>

      {team.length > 0 && (
        <section className="section alt">
          <div className="eyebrow">Organizing team</div>
          <h2 className="h2" style={{ marginBottom: 40 }}>The people behind {e.name}.</h2>
          <MemberGrid team={team} />
        </section>
      )}

      <Band image={e.page_images.band} title="Join the team." text="Run by volunteers. There's room for you.">
        <Go href={href(year, "volunteer")} className="btn btn-dark">Volunteer</Go>
        <Go href={c.organizer.url} className="btn join-outline">{c.organizer.name} ↗</Go>
      </Band>
    </>
  );
}
