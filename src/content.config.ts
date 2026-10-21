import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const experience = defineCollection({
  loader: glob({ pattern: "jobs/*.md", base: "./src/content/experience" }),
  schema: z.object({
    title: z.string(),
    company: z.string(),
    period: z.string(),
    description: z.string(),
    current: z.boolean().optional(),
    order: z.number().default(0),
    technologies: z.array(z.string()).optional(),
  }),
});

const education = defineCollection({
  loader: glob({ pattern: "education/*.md", base: "./src/content/experience" }),
  schema: z.object({
    institution: z.string(),
    period: z.string(),
    order: z.number().default(0),
    description: z.string(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      thumbnail: image(),
      technologies: z.array(z.string()),
      url: z.string().optional(),
      github: z.string().optional(),
      role: z.string().optional(),
      company: z.string().optional(),
      type: z.enum(["personal", "institutional"]),
      order: z.number().default(0),
    }),
});

export const collections = {
  experience,
  education,
  projects,
};
