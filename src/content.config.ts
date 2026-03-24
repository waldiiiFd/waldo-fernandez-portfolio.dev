import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const hero = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/hero' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    description: z.string(),
    ctas: z.array(z.object({
      label: z.string(),
      href: z.string(),
      variant: z.enum(['primary', 'outline']),
    })).optional(),
    specialties: z.array(z.object({
      title: z.string(),
      description: z.string(),
      icon: z.string(),
    })).optional(),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/experience' }),
  schema: z.object({
    jobs: z.array(z.object({
      title: z.string(),
      company: z.string(),
      period: z.string(),
      description: z.string(),
      current: z.boolean().optional(),
      technologies: z.array(z.string()).optional(),
    })),
    education: z.array(z.object({
      institution: z.string(),
      period: z.string(),
      description: z.string(),
    })),
  }),
});

export const collections = {
  hero,
  experience,
};
