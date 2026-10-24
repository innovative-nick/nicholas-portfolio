# Nicholas Aghah — Portfolio

Personal portfolio site. Built with [Astro](https://astro.build) and [GSAP](https://gsap.com), hosted on Cloudflare Pages, content managed in [Pages CMS](https://pagescms.org).

## Go live on Cloudflare Pages (one-time)

1. Log in to the Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Pick the `innovative-nick/nicholas-portfolio` repo.
3. **Project name:** `nicholas` (your address becomes `nicholas.pages.dev`). If it's taken, use `nicholasaghah`.
4. **Build settings:**
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Click **Save and Deploy**. The first build takes about a minute.
6. If the project name ended up different from `nicholas`, change `site:` in `astro.config.mjs` to the real address (this is used for link previews).

From then on, every commit to `main` (from Pages CMS or from code) redeploys the site automatically.

## Edit content in Pages CMS (one-time setup)

1. Go to [app.pagescms.org](https://app.pagescms.org) and sign in with GitHub.
2. Open `innovative-nick/nicholas-portfolio` (add the repo if it isn't listed).
3. You'll see two sections:
   - **Projects** — add, edit, reorder or hide the Featured Work cards. Upload a landscape screenshot (ideally 1600 × 1200 px, 4:3). Set **Position on the page** to control order; untick **Show on website** to hide one without deleting it.
   - **Site settings** — greeting, "since" line, hero sentence, the three stats, email, phone, WhatsApp, LinkedIn and the Figma link/image.
4. Click **Save**. The site updates about a minute later.

The six project cards start as placeholders (`[Project Name]`, `[Industry]` …). Replace them before you share the link.

## Run locally (optional)

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # production build in dist/
```

## Where things live

| What | Where |
| --- | --- |
| Page markup | `src/pages/index.astro` |
| Styles (desktop / tablet ≤1024px / mobile ≤640px) | `src/styles/global.css` |
| Animations | `src/scripts/main.js` |
| Projects (CMS) | `src/content/projects/*.md` |
| Site settings (CMS) | `src/data/site.json` |
| Images | `public/images/` |
| CMS config | `.pages.yml` |

Services and the Skills & Tools cards are edited in `src/pages/index.astro`.

Visitors who turn off animations in their device settings get the site without motion.
