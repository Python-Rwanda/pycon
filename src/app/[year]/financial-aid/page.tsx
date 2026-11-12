import type { Metadata } from "next";
import { Chips, Md, PageHeader, Steps, WindowCta } from "@/components/ui";
import { loadEdition, pagePhoto } from "@/lib/content";

export const metadata: Metadata = { title: "Financial aid" };

export default async function FinancialAidPage(props: { params: Promise<{ year: string }> }) {
  const { e, c } = await loadEdition(props);
  const fa = e.financial_aid;
  return (
    <>
      <PageHeader eyebrow={`${e.name} · Financial aid`} title="Money shouldn't stop you coming." photo={pagePhoto(e, "financial_aid")} intro={<Md html={fa.intro} />}>
        <WindowCta w={fa} label="Apply" fallback={{ label: "Ask a question", href: `mailto:${c.links.email}?subject=${encodeURIComponent(`${e.name} financial aid`)}` }} />
      </PageHeader>
      <section className="section" style={{ paddingTop: "clamp(32px,4vw,56px)", display: "grid", gap: 56 }}>
        {fa.covers.length > 0 && (
          <div>
            <div className="eyebrow y">Can cover</div>
            <Chips items={fa.covers} />
          </div>
        )}
        {fa.steps.length > 0 && (
          <div>
            <div className="eyebrow">How it works</div>
            <Steps steps={fa.steps} />
          </div>
        )}
      </section>
    </>
  );
}
