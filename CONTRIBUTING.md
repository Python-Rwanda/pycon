# Updating the PyCon Rwanda website

Everything that changes lives in [`content/`](content). You never need to touch the code to announce dates, open the call for proposals, add a speaker or a sponsor.

| What | File |
|---|---|
| Dates, venue, tickets, call for proposals, financial aid, volunteering, sponsorship packages, travel, FAQ, page photos. **Keep text short: one line where possible.** | `content/editions/<year>/edition.yaml` |
| Speakers | `content/editions/<year>/speakers.yaml` |
| Schedule | `content/editions/<year>/schedule.yaml` |
| Sponsors (logos) | `content/editions/<year>/sponsors.yaml` |
| Organizing team | `content/editions/<year>/team.yaml` |
| Conference name, contact email, social links, **which edition is current** | `content/conference.yaml` |
| Code of Conduct | `content/code-of-conduct.md` |

There are two ways to edit. Both change the same files.

---

## Option A: in the browser, no Git needed (the editor)

1. Go to **https://<site>/admin**.
2. Click **Sign in with GitHub**. You need write access to the repository; ask a maintainer to add you.
3. Pick **PyCon Rwanda 2027** (conference details, speakers, schedule, sponsors, team) or **Conference** (links, Code of Conduct) in the sidebar.
4. Fill in the form and **Save**. Each save is a commit to `main`, and the site rebuilds automatically (about 1–2 minutes).

## Option B: with a pull request

1. Create a branch and edit the files in `content/`.
2. Open a pull request. The **Check** action builds the site and tells you if anything is wrong, and the host posts a preview link.
3. Merge when it looks right.

---

## The conference year, step by step

| When | What to change |
|---|---|
| Dates confirmed | `dates.start` and `dates.end`, then **clear** `dates.label`. The countdown appears. Update `key_dates`. |
| Venue confirmed | `venue` (name, address, Google Maps link, photo). |
| Call for proposals | Set up [Pretalx](https://pretalx.com) (or a form), then set `cfp.url`, `cfp.opens`, `cfp.closes`. |
| Financial aid | `financial_aid.url`, `opens`, `closes`. |
| Sponsorship | Prices in `sponsorship.tiers`; upload the prospectus PDF as `sponsorship.prospectus`. |
| Sponsors sign | Add them to `sponsors.yaml`. `tier` must match a package name. |
| Speakers accepted | Add them to `speakers.yaml`; mark keynotes with `keynote: true` (they appear on the home page). |
| Schedule ready | Fill in `schedule.yaml`. Speaker names that match `speakers.yaml` link to their bio. |
| Tickets on sale | `tickets.url`, `tickets.opens`, prices in `tickets.tiers`. The nav button becomes *Get tickets*. |
| Hotels | `travel.hotels`. |

You don't need to "close" anything by hand: the site compares the dates to today (Kigali time) and rebuilds every night.

**Links in Markdown text:** write a page name on its own to link to that page of the same edition, e.g. `[financial aid](financial-aid)` or `[call for proposals](cfp)`. Other links need the full `https://...` address.

## Starting a new edition

1. Copy `content/editions/2027/` to `content/editions/2028/` and update everything in it (start by clearing speakers, schedule and sponsors).
2. In `public/admin/config.yml`, copy the `edition_2027` collection, change every `2027` in the copy to `2028`, and put it first.
3. When you're ready to send visitors to the new edition, change `current_edition` in `content/conference.yaml`.

The old edition stays online at `/2027`, with a banner pointing to the current one.

## Photos and videos

- **Files in this repo**: put them in `public/media/...` and reference them as `/media/...`. Keep them under ~5 MB.
- **Cloudinary**: paste `https://res.cloudinary.com/...` URLs. Cloudinary resizes and compresses them automatically.
- Speaker photos look best square. Sponsor logos look best as SVG or PNG on a transparent background, in a light colour or white (the site is dark).

## Running the site locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # also validates every file in content/
```

If a content file has a mistake, the build stops with a message naming the file and the field.

## One-time setup (maintainers)

1. **GitHub repository**: create it (e.g. `Python-Rwanda/pycon-rwanda-website`) and push this folder.
2. **Host on Vercel** (free): *Add New… → Project*, import the repository. This is a separate project from the community site. Every push to `main` deploys, and every PR gets a preview link.
3. **Domain**: Vercel → Project → Settings → *Domains*. See [README → Changing the domain](README.md#changing-the-domain).
4. **Site URL**: set `NEXT_PUBLIC_SITE_URL` (e.g. `https://pycon.pythonrwanda.org`) in Vercel's environment variables.
5. **Nightly rebuild**: Vercel → Settings → Git → *Deploy Hooks*: create a hook and add its URL to GitHub → Settings → Secrets → Actions as `DEPLOY_HOOK_URL`.
6. **Editor (Sveltia CMS)**: set `backend.repo` in `public/admin/config.yml`. For *Sign in with GitHub*, deploy the free [Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth) on Cloudflare Workers and set `backend.base_url`. (One authenticator can serve both the community site and this site: list both domains in its `ALLOWED_DOMAINS`.) Until then, editors can use *Sign in with Token*.
7. **Try the editor locally**: run `npm run dev`, open http://localhost:3000/admin in Chrome or Edge, click *Work with Local Repository* and pick this folder.

> Saving from the editor rewrites YAML files, so `# comments` in `content/*.yaml` may be removed. The explanations that matter are also in this file.
