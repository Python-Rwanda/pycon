// Client-safe types for content loaded by src/lib/content.ts.

export type Photo = {
  src: string;
  alt: string;
  /** CSS object-position, e.g. "50% 30%". */
  pos?: string;
};

/** Where a window (call for proposals, ticket sales, financial aid) stands today. */
export type Status = "tba" | "soon" | "open" | "closed";

export type Window = {
  status: Status;
  url?: string;
  opens?: string;
  closes?: string;
  /** e.g. "Opens Feb 1, 2027" / "Closes Mar 15, 2027" / "Closed" */
  label: string;
};

export type Links = {
  email: string;
  community_site: string;
  linkedin?: string;
  instagram?: string;
  x?: string;
  whatsapp?: string;
  mailing_list?: string;
};

/** What the nav and footer need to know about the conference, passed to client components. */
export type NavData = {
  name: string;
  current: number;
  years: number[];
  links: Links;
  organizer: { name: string; url: string };
  tickets: Record<number, Window>;
  copyrightYear: number;
};

export type Speaker = {
  name: string;
  role: string;
  bio?: string;
  photo?: string;
  keynote: boolean;
  country?: string;
  links: { label: string; url: string }[];
};

export type Sponsor = { name: string; tier: string; url?: string; logo?: string };
export type Member = { name: string; role: string; photo?: string; linkedin?: string };

export type Slot = {
  time: string;
  end?: string;
  title: string;
  kind: "keynote" | "talk" | "workshop" | "panel" | "lightning" | "break" | "social" | "other";
  speakers: string[];
  room?: string;
  abstract?: string;
};
export type Day = { date: string; label: string; dateLabel: string; slots: Slot[] };
