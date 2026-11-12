import type { Metadata } from "next";
import { SpeakerGrid } from "@/components/people";
import { ComingSoon, Go, PageHeader } from "@/components/ui";
import { getSpeakers, loadEdition, pagePhoto } from "@/lib/content";
import { href } from "@/lib/pages";

export const metadata: Metadata = { title: "Speakers" };

export default async function SpeakersPage(props: { params: Promise<{ year: string }> }) {
  const { year, e } = await loadEdition(props);
  const speakers = getSpeakers(year);
  const keynotes = speakers.filter((s) => s.keynote);
  const others = speakers.filter((s) => !s.keynote);
  return (
    <>
      <PageHeader eyebrow={`${e.name} · Speakers`} title="Speakers" photo={pagePhoto(e, "speakers")}
        intro="From Rwanda, across Africa and beyond." />
      <section className="section" style={{ paddingTop: "clamp(32px,4vw,56px)", display: "grid", gap: 64 }}>
        {speakers.length === 0 && (
          <ComingSoon title="Announced after the call for proposals." text={e.cfp.status === "open" ? "It's open now. This could be you." : "Want to speak? Watch for the call for proposals."}>
            <Go href={href(year, "cfp")} className="btn btn-y" style={{ marginTop: 24 }}>Call for proposals</Go>
          </ComingSoon>
        )}
        {keynotes.length > 0 && (
          <div>
            <div className="eyebrow y">Keynotes</div>
            <SpeakerGrid speakers={keynotes} full />
          </div>
        )}
        {others.length > 0 && (
          <div>
            <div className="eyebrow">{keynotes.length ? "Speakers" : ""}</div>
            <SpeakerGrid speakers={others} full />
          </div>
        )}
      </section>
    </>
  );
}
