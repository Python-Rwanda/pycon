import type { Metadata } from "next";
import { Md, PageHeader } from "@/components/ui";
import { loadEdition } from "@/lib/content";

export const metadata: Metadata = { title: "FAQ" };

export default async function FaqPage(props: { params: Promise<{ year: string }> }) {
  const { e, c } = await loadEdition(props);
  return (
    <>
      <PageHeader eyebrow={`${e.name} · FAQ`} title="Questions & answers"
        intro={<>Can&apos;t find what you&apos;re looking for? Email <a href={`mailto:${c.links.email}`}>{c.links.email}</a>.</>} />
      <section className="section faq" style={{ paddingTop: "clamp(16px,2vw,32px)", maxWidth: 900 }}>
        {e.faq.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <Md html={f.a} />
          </details>
        ))}
      </section>
    </>
  );
}
