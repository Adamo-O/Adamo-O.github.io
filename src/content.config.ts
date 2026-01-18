import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    href: z.string(),
    img: z.string(),
    dates: z.string(),
    skills: z.array(z.string()),
    link: z.string().optional(),
    github: z.string().optional(),
    secondLink: z.object({
      text: z.string(),
      link: z.string(),
    }).optional(),
    subtitle: z.string(),
    order: z.number().optional(),
    hidden: z.boolean().optional(),
    highlight: z.boolean().optional(),
    highlightSummary: z.string().optional(),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/experience" }),
  schema: z.object({
    position: z.string(),
    company: z.string(),
    href: z.string(),
    type: z.string(),
    dates: z.string(),
    img: z.string(),
    skills: z.array(z.string()),
    link: z.string().optional(),
    order: z.number().optional(),
    hidden: z.boolean().optional(),
    highlight: z.boolean().optional(),
    highlightSummary: z.string().optional(),
  }),
});

export const collections = { projects, experience };
