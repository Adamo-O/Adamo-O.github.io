import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

/**
 * "Month YYYY - Month YYYY", "Month - Month YYYY", "Month YYYY - Present" or a
 * single "Month YYYY". `sortContent` in src/lib/utils.ts parses this format.
 */
export const dateRange = z
  .string()
  .regex(
    /^[A-Z][a-z]+( \d{4})? - ([A-Z][a-z]+ \d{4}|Present)$|^[A-Z][a-z]+ \d{4}$/,
    'dates must look like "September 2023 - April 2024", "March - April 2023", "January 2024 - Present" or "January 2023"',
  );

/** Display flags shared by every list-style collection. */
const flags = {
  order: z.number().optional(),
  /** Excluded from every render, including /cv. */
  hidden: z.boolean().default(false),
  /** Pinned first and rendered as the wide/expanded card in its section. */
  highlight: z.boolean().default(false),
};

export const projectTags = [
  'web',
  'game',
  'research',
  'ml',
  'hardware',
  'bot',
  'hackathon',
] as const;

export const experienceTypes = [
  'Part-Time',
  'Internship',
  'Contract',
  'On-Call',
  'Teaching',
] as const;

export const publicationStatuses = [
  'under-review',
  'accepted',
  'preprint',
  'workshop',
  'withdrawn',
] as const;

export const awardKinds = ['award', 'scholarship', 'bursary', 'competition'] as const;

const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      href: z.string(),
      subtitle: z.string(),
      dates: dateRange,
      skills: z.array(z.string()),
      tags: z.array(z.enum(projectTags)).min(1),
      /** Static image or first-frame poster (relative path, e.g. ../../assets/projects/handle.png). */
      img: image(),
      /** Optional looping clip served from public/, e.g. /media/arduino-robot.webm; rendered over `img` as poster. */
      video: z.string().optional(),
      link: z.string().url().optional(),
      github: z.string().url().optional(),
      secondLink: z.object({ text: z.string(), link: z.string() }).optional(),
      highlightSummary: z.string().optional(),
      /** Bullets used on /cv (CV wording, may differ from the body). */
      cvBullets: z.array(z.string()).optional(),
      /** Listed on /cv. */
      cv: z.boolean().default(false),
      ...flags,
    }),
});

const experience = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/experience' }),
  schema: ({ image }) =>
    z.object({
      position: z.string(),
      company: z.string(),
      href: z.string(),
      type: z.enum(experienceTypes),
      dates: dateRange,
      location: z.string().optional(),
      /** Company logo; when absent the component renders a monogram fallback. */
      img: image().optional(),
      /** Switches the logo tile to a dark surface for light/white wordmarks. */
      logoTone: z.enum(['light', 'dark']).default('light'),
      /** Allows long wordmarks to retain a legible aspect ratio. */
      logoWide: z.boolean().default(false),
      skills: z.array(z.string()),
      link: z.string().url().optional(),
      highlightSummary: z.string().optional(),
      /** Optional public-facing impact figures displayed as a compact metric row. */
      impactStats: z
        .array(
          z.object({
            value: z.string(),
            label: z.string(),
          }),
        )
        .max(4)
        .optional(),
      /** Rendered inside the collapsed "earlier roles" group. */
      collapsed: z.boolean().default(false),
      cvBullets: z.array(z.string()).optional(),
      cv: z.boolean().default(true),
      ...flags,
    }),
});

const publications = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/publications' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        /** Component bolds entries equal to profile.name. */
        authors: z.array(z.string()).min(1),
        venue: z.string().optional(),
        year: z.number().int(),
        status: z.enum(publicationStatuses),
        /** 15-20 words. */
        summary: z.string().min(40).max(220),
        thumbnail: image().optional(),
        /** Concise description of the diagram's meaning, not its appearance. */
        thumbnailAlt: z.string().min(20).max(240).optional(),
        thumbnailCaption: z.string().max(160).optional(),
        /** Crops source-page caption fragments while preserving the full diagram width. */
        thumbnailCrop: z.boolean().default(false),
        links: z
          .object({
            pdf: z.string().optional(),
            arxiv: z.string().optional(),
            code: z.string().optional(),
            project: z.string().optional(),
            openreview: z.string().url().optional(),
            secondary: z
              .object({
                label: z.string(),
                url: z.string().url(),
              })
              .optional(),
          })
          .default({}),
        /** First topic drives the right-rail grouping. */
        topics: z.array(z.string()).default([]),
        ...flags,
      })
      .refine((p) => p.status !== 'under-review' || !p.venue, {
        message: 'under-review entries must not list a venue',
        path: ['venue'],
      })
      .refine((p) => !p.thumbnail || Boolean(p.thumbnailAlt), {
        message: 'publication thumbnails require descriptive alt text',
        path: ['thumbnailAlt'],
      }),
});

const yearMonth = z.string().regex(/^\d{4}-\d{2}$/, 'expected YYYY-MM');

const education = defineCollection({
  loader: file('./src/content/education.json'),
  schema: z.object({
    degree: z.string(),
    field: z.string(),
    institution: z.string(),
    location: z.string(),
    start: yearMonth,
    end: yearMonth,
    expected: z.boolean().default(false),
    gpa: z.string().optional(),
    notes: z.array(z.string()).default([]),
    /** Asset key resolved by the component (e.g. "concordia"); missing -> monogram. */
    logo: z.string().optional(),
    order: z.number(),
  }),
});

const awards = defineCollection({
  loader: file('./src/content/awards.json'),
  schema: z.object({
    title: z.string(),
    issuer: z.string(),
    date: yearMonth,
    kind: z.enum(awardKinds),
    placement: z.string().optional(),
    logo: z.string().optional(),
    url: z.string().url().optional(),
  }),
});

const teaching = defineCollection({
  loader: file('./src/content/teaching.json'),
  schema: z.object({
    code: z.string(),
    title: z.string(),
    role: z.string(),
    institution: z.string(),
    terms: z.array(z.string()).min(1),
    description: z.string().optional(),
  }),
});

export const collections = {
  projects,
  experience,
  publications,
  education,
  awards,
  teaching,
};
