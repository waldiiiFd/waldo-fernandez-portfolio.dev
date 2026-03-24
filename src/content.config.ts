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

export const collections = {
  hero,
};