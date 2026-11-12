"use client";

import { usePathname } from "next/navigation";

/** The edition the visitor is looking at: the year in the URL, or the current edition on shared pages. */
export function useYear(years: number[], current: number) {
  const seg = Number(usePathname().split("/")[1]);
  return years.includes(seg) ? seg : current;
}
