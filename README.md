# Eidos Design Pattern

Portfolio portal for **300 system design essays** (Basic → Intermediate → Advanced), hosted on **GitHub Pages**.

| Tier | Code | Audience |
| ---- | ---- | -------- |
| Basic | B01–B100 | Foundations and vocabulary |
| Intermediate | I01–I100 | Distributed patterns, data, messaging, reliability |
| Advanced | A01–A100 | Consensus, storage internals, planet-scale case studies |

## Local development

```bash
cd C:\Users\spanda\Projects\Eidos-Design-Pattern
npm install
npm run dev
```

- **`npm run generate:stubs`** — Regenerate `src/data/catalog.json` and create missing MDX placeholders (does not overwrite existing posts).
- **`npm run build`** — Generate stubs + static site to `dist/`.

## Content model

Each topic is one MDX file:

`src/content/topics/{basic|intermediate|advanced}/{b01-slug}.mdx`

Frontmatter fields: `id`, `tier`, `category`, `title`, `slug`, `publishOrder`, `status`, `series`.

Every stub includes sections aligned with your editorial template:

1. **Concept**
2. **Trade-offs**
3. **Diagram** (Mermaid)
4. **Failure modes**
5. **Real-world example**

Set `status: published` when an article is ready for readers (optional filter later).

## Site map (information architecture)

| Route | Purpose |
| ----- | ------- |
| `/` | Hero, tier cards, cross-tier **series**, reading entry (B01…) |
| `/basic/`, `/intermediate/`, `/advanced/` | Tier hub: **categories** as sections, topic lists with IDs |
| `/{tier}/{slug}/` | Article + series sidebar + prev/next by **publish order** |
| `/series/{slug}/` | Curated path (Caching, Data & Replication, Resilience, Messaging, Case Studies) |

**Cross-tier series** (defined in `scripts/catalog-data.mjs`):

- `caching` — B39–B46, I59–I62  
- `data-and-replication` — B54–B57, I29–I39  
- `resilience` — B37–B38, I17–I19, A49–A56  
- `messaging` — B61–B68, I49–I58  
- `case-studies` — B100, I91–I100, A89–A100  

## GitHub repository setup

1. Create a public repo: **`Eidos-Design-Pattern`** (match repo name to `base` in `astro.config.mjs`).
2. Push this project:

   ```bash
   git add .
   git commit -m "Initial Eidos portal scaffold with 300 topic stubs"
   git remote add origin https://github.com/YOUR_USERNAME/Eidos-Design-Pattern.git
   git push -u origin main
   ```

3. In **Settings → Pages → Build and deployment**, choose **GitHub Actions** (workflow included in `.github/workflows/deploy-pages.yml`).
4. Edit `astro.config.mjs`:

   ```js
   site: "https://YOUR_GITHUB_USERNAME.github.io",
   base: "/Eidos-Design-Pattern",
   ```

   For a **user/org site** repo named `YOUR_USERNAME.github.io`, set `base: "/"` instead.

5. Optional: add `public/CNAME` for a custom domain (e.g. `eidos.yourdomain.com`).

## Publishing workflow (recommended)

1. Write in tier order **or** pick a **series** and draft in sequence.
2. Replace `_TODO_` sections in the MDX file; keep one Mermaid diagram per post.
3. Flip `status` to `published` when complete.
4. Push to `main` — CI builds and deploys Pages.

## Tech stack

- [Astro 5](https://astro.build) static site + MDX  
- Content collections with glob loader  
- `@astrojs/sitemap` for SEO  
- GitHub Actions → GitHub Pages  

## Roadmap (optional enhancements)

- Pagefind or Fuse.js client search across titles and headings  
- RSS feed for newly `published` topics  
- “Progress” checklist per series (localStorage or signed-in profile)  
- Author bio / ADR links on homepage for portfolio branding  

---

**Lead architect note:** Treat this repo as your **canonical design library**—PRs per topic keep review history and show depth over time on GitHub.
