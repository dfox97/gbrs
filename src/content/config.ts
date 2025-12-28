import { defineCollection, z } from 'astro:content';
import { PROJECT_CATEGORIES } from '../consts';

const projectsCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    category: z.enum(Object.keys(PROJECT_CATEGORIES) as [keyof typeof PROJECT_CATEGORIES, ...Array<keyof typeof PROJECT_CATEGORIES>]),
    services: z.array(z.string()).optional(),
    description: z.string(),
    thumbnail: image(),
    gallery: z.array(image()).default([]),
    featured: z.boolean().default(false),
    order: z.number().default(100),
  }),
});

const certificationsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    details: z.string(),
    link: z.string().url(),
    order: z.number().default(100),
  }),
});

export const collections = {
  'projects': projectsCollection,
  'certifications': certificationsCollection,
};
