import type { MetadataRoute } from "next";
import { getYears } from "@/lib/content";
import { href, PAGES } from "@/lib/pages";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const paths = [...getYears().flatMap((y) => PAGES.map((p) => href(y, p.slug))), "/code-of-conduct", "/editions"];
  return paths.map((p) => ({ url: base + p }));
}
