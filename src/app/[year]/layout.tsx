import type { Metadata } from "next";
import { getEdition, getYears } from "@/lib/content";

// One set of pages per edition: /2027, /2027/speakers ... Years without a folder in content/editions 404.
export const dynamicParams = false;
export function generateStaticParams() {
  return getYears().map((y) => ({ year: String(y) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const e = getEdition(Number((await params).year));
  return {
    title: { absolute: e.name, template: `%s · ${e.name}` },
    description: e.tagline,
    openGraph: { title: e.name, description: e.tagline, images: e.hero.poster ? [e.hero.poster] : undefined },
  };
}

export default function EditionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
