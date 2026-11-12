import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { marked } from "marked";
import YAML from "yaml";
import { z } from "zod";
import type { Day, Member, NavData, Photo, Speaker, Sponsor, Status, Window } from "./types";

/*
 * All editable content lives in /content (YAML + Markdown) and is read at build time.
 *
 *   content/conference.yaml            things that stay the same every year
 *   content/code-of-conduct.md
 *   content/editions/<year>/edition.yaml   dates, venue, tickets, CfP, travel, FAQ...
 *   content/editions/<year>/speakers.yaml
 *   content/editions/<year>/schedule.yaml
 *   content/editions/<year>/sponsors.yaml
 *   content/editions/<year>/team.yaml
 *
 * Every file is validated; a mistake fails the build with a message naming the file.
 */

const ROOT = path.join(process.cwd(), "content");
const TZ = "Africa/Kigali";
const TZ_OFFSET = "+02:00";

// ── Schema helpers ────────────────────────────────────────────────────────
const img = z.string().regex(/^(\/|https:\/\/)/, "must start with / (a file in public/) or https://");
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "must be a date like 2027-08-20");
const time = z.string().regex(/^\d{2}:\d{2}$/, "must be a time like 09:30");
/** Treats "" and null (what the editor saves for empty fields) as "not set". */
const opt = <T extends z.ZodType>(s: T) => z.preprocess((v) => (v === "" || v === null ? undefined : v), s.optional());
/** A list that may be written as `[]`, left empty, or omitted. */
const list = <T extends z.ZodType>(s: T) => z.array(s).nullable().optional().transform((v) => v ?? []);
const step = z.object({ title: z.string(), text: z.string() });
const md = z.string().nullable().optional().transform((v) => (v ? (marked.parse(v, { async: false }) as string) : ""));

const LinksSchema = z.object({
  email: z.email(),
  community_site: z.url(),
  linkedin: opt(z.url()),
  instagram: opt(z.url()),
  x: opt(z.url()),
  whatsapp: opt(z.url()),
  mailing_list: opt(z.url()),
});

const ConferenceSchema = z.object({
  name: z.string(),
  current_edition: z.number().int(),
  organizer: z.object({ name: z.string(), url: z.url() }),
  links: LinksSchema,
});

const WindowSchema = z.object({ url: opt(z.url()), opens: opt(date), closes: opt(date) });

const EditionSchema = z.object({
  tagline: z.string(),
  city: z.string(),
  country: z.string().default("Rwanda"),
  dates: z.object({ start: opt(date), end: opt(date), label: opt(z.string()) }).default({}),
  venue: z.object({ name: z.string(), address: opt(z.string()), map_url: opt(z.url()), photo: opt(img) }),
  hero: z.object({ video: opt(img), poster: opt(img) }).default({}),
  page_images: z.record(z.string(), img).default({}),
  photos: list(img),

  about: md,
  formats: list(z.object({ name: z.string(), text: z.string() })),
  audience: list(z.string()),
  key_dates: list(z.object({ label: z.string(), date: opt(date), text: opt(z.string()) })),

  tickets: WindowSchema.extend({
    intro: md,
    tiers: list(z.object({ name: z.string(), price: z.string(), note: opt(z.string()), includes: list(z.string()) })),
    note: md,
  }),
  cfp: WindowSchema.extend({
    intro: md,
    formats: list(z.object({ name: z.string(), length: z.string(), text: z.string() })),
    topics: list(z.object({ name: z.string(), text: z.string(), code: opt(z.string()) })),
    steps: list(step),
  }),
  financial_aid: WindowSchema.extend({ intro: md, covers: list(z.string()), steps: list(step) }),
  volunteer: z.object({ url: opt(z.url()), intro: md, roles: list(z.object({ name: z.string(), text: z.string() })) }),
  sponsorship: z.object({
    prospectus: opt(z.string().regex(/^(\/|https:\/\/)/, "must start with / or https://")),
    intro: md,
    tiers: list(z.object({ name: z.string(), price: z.string(), slots: opt(z.string()), benefits: list(z.string()) })),
  }),
  travel: z.object({
    intro: md,
    sections: list(z.object({ title: z.string(), body: md })),
    hotels: list(z.object({ name: z.string(), note: opt(z.string()), url: opt(z.url()) })),
  }),
  faq: list(z.object({ q: z.string(), a: md })),
});
export type EditionRaw = z.infer<typeof EditionSchema>;

const SpeakersSchema = list(
  z.object({
    name: z.string(),
    role: z.string().default(""),
    bio: opt(z.string()),
    photo: opt(img),
    keynote: z.boolean().default(false),
    country: opt(z.string()),
    links: list(z.object({ label: z.string(), url: z.url() })),
  }),
);
const SponsorsSchema = list(z.object({ name: z.string(), tier: z.string(), url: opt(z.url()), logo: opt(img) }));
const TeamSchema = list(z.object({ name: z.string(), role: z.string(), photo: opt(img), linkedin: opt(z.url()) }));
const ScheduleSchema = z.object({
  days: list(
    z.object({
      date,
      label: z.string(),
      slots: list(
        z.object({
          time,
          end: opt(time),
          title: z.string(),
          kind: z.enum(["keynote", "talk", "workshop", "panel", "lightning", "break", "social", "other"]).default("talk"),
          speakers: list(z.string()),
          room: opt(z.string()),
          abstract: opt(z.string()),
        }),
      ),
    }),
  ),
});

// ── File helpers ──────────────────────────────────────────────────────────
function parse<T>(schema: z.ZodType<T>, data: unknown, file: string): T {
  const r = schema.safeParse(data);
  if (!r.success) throw new Error(`\n\nInvalid content in content/${file}:\n${z.prettifyError(r.error)}\n`);
  return r.data;
}

function readYaml<T>(file: string, schema: z.ZodType<T>, fallback?: unknown): T {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) {
    if (fallback === undefined) throw new Error(`Missing content file: content/${file}`);
    return parse(schema, fallback, file);
  }
  return parse(schema, YAML.parse(fs.readFileSync(full, "utf8")), file);
}

// ── Dates ─────────────────────────────────────────────────────────────────
/** Today's date in Kigali as yyyy-MM-dd. */
function todayKigali() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

export const fmt = (d: string, o: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }) =>
  new Intl.DateTimeFormat("en-US", { timeZone: "UTC", ...o }).format(new Date(d + "T00:00:00Z"));

function rangeLabel(start: string, end?: string) {
  if (!end || end === start) return fmt(start, { month: "long", day: "numeric", year: "numeric" });
  const [sy, sm] = start.split("-");
  const [ey, em] = end.split("-");
  if (sy === ey && sm === em) return `${fmt(start, { month: "long", day: "numeric" })}–${fmt(end, { day: "numeric" })}, ${sy}`;
  if (sy === ey) return `${fmt(start, { month: "long", day: "numeric" })} – ${fmt(end, { month: "long", day: "numeric" })}, ${sy}`;
  return `${fmt(start)} – ${fmt(end)}`;
}

function windowOf(w: { url?: string; opens?: string; closes?: string }, today: string): Window {
  let status: Status;
  if (w.closes && today > w.closes) status = "closed";
  else if (w.opens && today < w.opens) status = "soon";
  else if (w.opens || w.url) status = "open";
  else status = "tba";
  const label =
    status === "closed" ? "Closed" :
    status === "soon" ? `Opens ${fmt(w.opens!)}` :
    status === "open" ? (w.closes ? `Open until ${fmt(w.closes)}` : "Open now") :
    "Dates to be announced";
  return { status, url: w.url, opens: w.opens, closes: w.closes, label };
}

// ── Public API ────────────────────────────────────────────────────────────
export const getConference = cache(() => readYaml("conference.yaml", ConferenceSchema));

/** Every edition that has a folder in content/editions, newest first. */
export const getYears = cache((): number[] => {
  const dir = path.join(ROOT, "editions");
  const years = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^\d{4}$/.test(d.name))
    .map((d) => Number(d.name))
    .sort((a, b) => b - a);
  const { current_edition } = getConference();
  if (!years.includes(current_edition)) {
    throw new Error(`content/conference.yaml: current_edition is ${current_edition} but content/editions/${current_edition}/ does not exist`);
  }
  return years;
});

export type Edition = Omit<EditionRaw, "tickets" | "cfp" | "financial_aid" | "key_dates"> & {
  year: number;
  name: string;
  dateLabel: string;
  /** ISO start (Kigali time) for the countdown, when the start date is set. */
  startsAt?: string;
  /** The conference is over. */
  past: boolean;
  tickets: EditionRaw["tickets"] & Window;
  cfp: EditionRaw["cfp"] & Window;
  financial_aid: EditionRaw["financial_aid"] & Window;
  key_dates: (EditionRaw["key_dates"][number] & { when: string; done: boolean })[];
};

/**
 * In Markdown, a link to a bare page name like [financial aid](financial-aid) means "this edition's page",
 * so it works from any page: it becomes /<year>/financial-aid.
 */
function scopeLinks<T>(v: T, year: number): T {
  if (typeof v === "string") return v.replace(/href="([a-z0-9-]+(?:#[\w-]*)?)"/g, `href="/${year}/$1"`) as T;
  if (Array.isArray(v)) return v.map((x) => scopeLinks(x, year)) as T;
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, scopeLinks(x, year)])) as T;
  return v;
}

export const getEdition = cache((year: number): Edition => {
  const e = scopeLinks(readYaml(`editions/${year}/edition.yaml`, EditionSchema), year);
  const today = todayKigali();
  const { start, end, label } = e.dates;
  const last = end ?? start;
  return {
    ...e,
    year,
    name: `${getConference().name} ${year}`,
    dateLabel: label ?? (start ? rangeLabel(start, end) : `${year} · dates to be announced`),
    startsAt: start ? `${start}T09:00:00${TZ_OFFSET}` : undefined,
    past: last ? today > last : false,
    // Ticket sales close when the conference ends unless a closing date is given.
    tickets: { ...e.tickets, ...windowOf({ ...e.tickets, closes: e.tickets.closes ?? last }, today) },
    cfp: { ...e.cfp, ...windowOf(e.cfp, today) },
    financial_aid: { ...e.financial_aid, ...windowOf(e.financial_aid, today) },
    key_dates: e.key_dates.map((k) => ({ ...k, when: k.text ?? (k.date ? fmt(k.date) : "TBA"), done: !!k.date && today > k.date })),
  };
});

export const getSpeakers = cache((year: number): Speaker[] => readYaml(`editions/${year}/speakers.yaml`, SpeakersSchema, []));
export const getSponsors = cache((year: number): Sponsor[] => readYaml(`editions/${year}/sponsors.yaml`, SponsorsSchema, []));
export const getTeam = cache((year: number): Member[] => readYaml(`editions/${year}/team.yaml`, TeamSchema, []));
export const getSchedule = cache((year: number): Day[] =>
  readYaml(`editions/${year}/schedule.yaml`, ScheduleSchema, { days: [] }).days.map((d) => ({
    ...d,
    dateLabel: fmt(d.date, { weekday: "long", month: "long", day: "numeric" }),
  })),
);

export const getCodeOfConduct = cache(() => {
  const raw = fs.readFileSync(path.join(ROOT, "code-of-conduct.md"), "utf8");
  return marked.parse(raw, { async: false }) as string;
});

/** Everything the (client-side) nav and footer need. */
export const getNavData = cache((): NavData => {
  const c = getConference();
  const years = getYears();
  return {
    name: c.name,
    current: c.current_edition,
    years,
    links: c.links,
    organizer: c.organizer,
    copyrightYear: Number(todayKigali().slice(0, 4)),
    tickets: Object.fromEntries(
      years.map((y) => {
        const { status, url, opens, closes, label } = getEdition(y).tickets;
        return [y, { status, url, opens, closes, label }];
      }),
    ),
  };
});

type YearParams = { params: Promise<{ year: string }> };

/** For pages under /[year]: the year and its edition (unknown years already 404 via dynamicParams = false). */
export async function loadEdition({ params }: YearParams) {
  const year = Number((await params).year);
  return { year, e: getEdition(year), c: getConference() };
}

/** Header photo for a page: page_images.<key>, else page_images.default. */
export function pagePhoto(e: Edition, key: string): Photo | undefined {
  const src = e.page_images[key] ?? e.page_images.default;
  return src ? { src, alt: "" } : undefined;
}
