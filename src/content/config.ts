import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    category: z.enum(['agricultural', 'industrial', 'recladding', 'groundworks', 'new-build']),
    description: z.string(),
    thumbnail: image(),
    gallery: z.array(image()).default([]),
    featured: z.boolean().default(false),
    order: z.number().default(100),
  }),
});

export const collections = {
  'projects': projectsCollection,
};
