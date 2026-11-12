import type { Metadata } from "next";
import { CardGrid, Go, Md, PageHeader } from "@/components/ui";
import { loadEdition, pagePhoto } from "@/lib/content";

export const metadata: Metadata = { title: "Volunteer" };

export default async function VolunteerPage(props: { params: Promise<{ year: string }> }) {
  const { e, c } = await loadEdition(props);
  const v = e.volunteer;
  const signup = v.url ?? `mailto:${c.links.email}?subject=${encodeURIComponent(`Volunteering at ${e.name}`)}`;
  return (
    <>
      <PageHeader eyebrow={`${e.name} · Volunteer`} title="Help make it happen." photo={pagePhoto(e, "volunteer")} intro={<Md html={v.intro} />}>
        <Go href={signup} className="btn btn-y" style={{ marginTop: 28 }}>Sign up to volunteer</Go>
      </PageHeader>
      {v.roles.length > 0 && (
        <section className="section" style={{ paddingTop: "clamp(32px,4vw,56px)" }}>
          <div className="eyebrow">Ways to help</div>
          <h2 className="h2" style={{ marginBottom: 40 }}>Pick what suits you.</h2>
          <CardGrid items={v.roles.map((r) => ({ title: r.name, text: r.text }))} />
        </section>
      )}
    </>
  );
}
