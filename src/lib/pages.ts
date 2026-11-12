/** Every page of an edition, in menu order. `slug` is the path after /<year>/. */
export const PAGES = [
  { slug: "", label: "Overview" },
  { slug: "speakers", label: "Speakers", top: true },
  { slug: "schedule", label: "Schedule", top: true },
  { slug: "cfp", label: "Call for proposals", short: "Speak", top: true },
  { slug: "tickets", label: "Tickets" },
  { slug: "sponsors", label: "Sponsors", top: true },
  { slug: "travel", label: "Travel & venue", short: "Travel", top: true },
  { slug: "financial-aid", label: "Financial aid" },
  { slug: "volunteer", label: "Volunteer" },
  { slug: "faq", label: "FAQ", top: true },
  { slug: "about", label: "About & team" },
] as const;

export const href = (year: number, slug = "") => (slug ? `/${year}/${slug}` : `/${year}`);
