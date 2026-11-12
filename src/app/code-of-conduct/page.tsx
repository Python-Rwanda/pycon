import type { Metadata } from "next";
import { Md, PageHeader } from "@/components/ui";
import { getCodeOfConduct, getConference } from "@/lib/content";

export const metadata: Metadata = {
  title: "Code of Conduct",
  description: "How we expect everyone to behave at PyCon Rwanda, and how to report a problem.",
};

export default function CodeOfConductPage() {
  const c = getConference();
  const mail = `mailto:${c.links.email}?subject=${encodeURIComponent("Code of Conduct report")}`;
  return (
    <>
      <PageHeader eyebrow="Code of Conduct" title="A welcoming conference, for everyone."
        intro={`This applies to everyone taking part in ${c.name}: attendees, speakers, sponsors, volunteers and organizers.`} />
      <section className="section" style={{ paddingTop: "clamp(24px,3vw,40px)" }}>
        <Md html={getCodeOfConduct()} />
        <p style={{ fontSize: 18, lineHeight: 1.7, color: "var(--ink-2)", maxWidth: 680, marginTop: 32 }}>
          Report a problem: <a href={mail}>{c.links.email}</a>
        </p>
      </section>
    </>
  );
}
