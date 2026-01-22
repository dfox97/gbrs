import { getCollection } from 'astro:content';

export async function GET() {
  const projects = await getCollection('projects');
  const certs = await getCollection('certifications');

  const data = {
    projects: projects.map(p => {
      let thumbUrl = '';
      if (p.data.thumbnail) {
        // @ts-ignore - Use the live processed src from Astro
        thumbUrl = p.data.thumbnail.src || p.data.thumbnail;
      }

      return {
        title: p.data.title,
        category: p.data.category,
        description: p.data.description,
        thumbnail: thumbUrl,
        order: p.data.order || 100,
        gallery: (p.data.gallery || []).map((img: any) => img.src || img)
      };
    }),
    certs: certs.map(c => ({
      title: c.data.title,
      description: c.data.description,
      details: c.data.details,
      link: c.data.link,
      order: c.data.order || 100
    }))
  };

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
}
