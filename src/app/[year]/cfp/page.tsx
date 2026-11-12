import type { Metadata } from "next";
import Link from "next/link";
import { CardGrid, Md, PageHeader, Steps, Topics, WindowCta } from "@/components/ui";
import { loadEdition, pagePhoto } from "@/lib/content";
import { href } from "@/lib/pages";

export const metadata: Metadata = { title: "Call for proposals" };

export default async function CfpPage(props: { params: Promise<{ year: string }> }) {
  const { year, e, c } = await loadEdition(props);
  const { cfp } = e;
  return (
    <>
      <PageHeader eyebrow={`${e.name} · Call for proposals`} title="Speak at PyCon Rwanda." photo={pagePhoto(e, "cfp")} intro={<Md html={cfp.intro} />}>
        <WindowCta w={cfp} label="Submit a proposal" fallback={{ label: "Ask us a question", href: `mailto:${c.links.email}?subject=${encodeURIComponent(`${e.name} talk proposal`)}` }} />
      </PageHeader>

      {cfp.formats.length > 0 && (
        <section className="section" style={{ paddingTop: "clamp(32px,4vw,56px)" }}>
          <div className="eyebrow">Formats</div>
          <CardGrid items={cfp.formats.map((f) => ({ title: f.name, text: f.text, meta: f.length }))} min={240} />
        </section>
      )}

      {cfp.topics.length > 0 && (
        <section className="section alt">
          <div className="eyebrow y">Topics</div>
          <h2 className="h2" style={{ fontSize: "clamp(30px,3.6vw,52px)" }}>Anything Python.</h2>
          <p style={{ fontSize: 17, color: "var(--ink-2)", margin: "14px 0 32px" }}>Some ideas to start from. Not on the list? Propose it anyway.</p>
          <Topics items={cfp.topics} />
        </section>
      )}

      {cfp.steps.length > 0 && (
        <section className="section">
          <div className="eyebrow">How it works</div>
          <Steps steps={cfp.steps} />
          <p style={{ color: "var(--ink-3)", fontSize: 15, marginTop: 40 }}>
            <Link href={href(year, "financial-aid")}>Financial aid</Link> is open to speakers · <Link href="/code-of-conduct">Code of Conduct</Link>
          </p>
        </section>
      )}
    </>
  );
}
