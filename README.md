# PyCon Rwanda website

The website of **PyCon Rwanda**, the Python conference in Rwanda, organized by [Python Rwanda](https://pythonrwanda.org).

It is a separate site from the Python Rwanda community website, with its own domain, but it uses the same stack and design. Content is stored as plain YAML/Markdown files, so organizers can update the site from a browser without touching code.

## Pages

Every edition has its own set of pages under its year, and old editions stay online as an archive:

| Path | Page |
|---|---|
| `/` | Redirects to the current edition (`current_edition` in `content/conference.yaml`) |
| `/2027` | Overview: dates, countdown, what's open now, key dates, keynotes, sponsors |
| `/2027/speakers` | Speakers (keynotes first) |
| `/2027/schedule` | Programme, day by day |
| `/2027/cfp` | Call for proposals: formats, topics, process |
| `/2027/tickets` | Ticket types and the link to the ticket shop |
| `/2027/sponsors` | Sponsors by tier, sponsorship packages, prospectus |
| `/2027/travel` | Venue, visas, getting there, hotels |
| `/2027/financial-aid` | Financial aid |
| `/2027/volunteer` | Volunteering |
| `/2027/faq` | FAQ |
| `/2027/about` | About the conference and the organizing team |
| `/code-of-conduct` | Code of Conduct (shared by all editions) |
| `/editions` | All editions |

Pages that aren't ready yet (no speakers, no schedule...) show a "coming soon" block instead of being empty.

**Status updates itself.** Give the call for proposals, ticket sales and financial aid an `opens` and `closes` date, and the site shows "Opening soon", "Open" (with the link) or "Closed" on its own. The home page buttons change too: *Get tickets* while tickets are on sale, *Submit a talk* while the call for proposals is open. A nightly rebuild keeps this current.

## Updating content

See **[CONTRIBUTING.md](CONTRIBUTING.md)**: in the browser at `/admin`, or with a pull request on the files in [`content/`](content).

## Development

Requires Node.js 20+.

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build; also validates every file in `content/` |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm run check` | All of the above, as run in CI |

## Project structure

```
content/
  conference.yaml           name, current edition, contact links (shared by all editions)
  code-of-conduct.md
  editions/<year>/
    edition.yaml              dates, venue, tickets, CfP, financial aid, sponsorship, travel, FAQ...
    speakers.yaml
    schedule.yaml
    sponsors.yaml
    team.yaml
public/
  admin/                    content editor (Sveltia CMS) served at /admin
  media/                    images and videos stored in the repository
src/
  app/[year]/...            the pages of one edition
  app/code-of-conduct, app/editions
  components/               UI components (shared look with the Python Rwanda site)
  lib/content.ts            loads and validates content/ at build time (zod)
  lib/pages.ts              the list of edition pages (menu, footer, sitemap)
```

Pages are statically generated from `content/` at build time. Invalid content fails the build with a message naming the file and field.

## Deployment

Designed for [Vercel](https://vercel.com) (free tier) as its **own project**, separate from the community site; any host that runs Next.js works. One-time setup is in [CONTRIBUTING.md → One-time setup](CONTRIBUTING.md#one-time-setup-maintainers).

## Changing the domain

The domain is not hardcoded anywhere in the code. To move the site (for example from `pycon.pythonrwanda.org` to `pycon.rw`):

1. **Host:** Vercel → Project → Settings → *Domains*: add the new domain and follow the DNS instructions at your registrar.
2. **Redirect the old domain:** keep the old domain in the same list and set it to redirect to the new one, so existing links keep working.
3. **Environment variable:** change `NEXT_PUBLIC_SITE_URL` in Vercel → Settings → *Environment Variables*, then redeploy. This updates link previews, canonical URLs, `sitemap.xml` and `robots.txt`.
4. **Editor sign-in:** if you use the Sveltia CMS Authenticator, add the new domain to its allowed domains (`ALLOWED_DOMAINS` on the Cloudflare Worker).
5. **Email:** if you want an address on the new domain (e.g. `hello@pycon.rw`), set up mail records at the registrar, then update `links.email` in `content/conference.yaml`.
6. **Elsewhere:** update the link in Pretalx, the ticket shop, social media bios and the Python Rwanda community site.

## Name

"PyCon" is a trademark of the Python Software Foundation. Community conferences use it with the PSF's permission; see the [PSF trademark usage policy](https://www.python.org/psf/trademarks/).

## License

Source code: [MIT](LICENSE). Photos, logos and written content belong to Python Rwanda and the people pictured, and are not licensed for reuse.
