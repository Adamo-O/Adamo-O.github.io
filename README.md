# Adamo Orsini's portfolio

Source for [adamoorsini.com](https://adamoorsini.com), a research and engineering portfolio built with Astro, React islands, Tailwind CSS, and Astro content collections.

## Local development

```bash
npm ci
npm run dev
```

Before opening a pull request or deploying:

```bash
npm run build
```

The build command runs Astro and TypeScript checks, generates the static site, and verifies the required routes, section anchors, PDFs, and sitemap.

## Structure

- `src/pages/index.astro` composes the portfolio homepage.
- `src/pages/cv.astro` renders the web and print-friendly CV.
- `src/content/` stores projects, experience, publications, education, awards, and teaching data.
- `src/data/profile.ts` is the shared source for profile and contact details.
- `src/components/layout/` contains the responsive sidebar, mobile navigation, section rails, and page shell.
- `src/components/hero/` contains the homepage introduction and live-status presentation.
- `src/styles/globals.css` defines the light/dark design tokens and global interaction styles.
- `public/files/` contains downloadable portfolio documents.

## Content conventions

Content entries are validated by `src/content.config.ts`. Incomplete or private entries should use their collection's `hidden` flag rather than publishing placeholder text. Project media should include an optimized poster image; optional MP4/WebM clips live in `public/media/`.

## Deployment

Pushes to `main` deploy through GitHub Pages using `.github/workflows/deploy.yml`. The workflow performs the same type, build, and generated-output checks as local development before uploading the site.
