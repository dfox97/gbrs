import fs from 'node:fs/promises';
import path from 'node:path';
import type { APIRoute } from 'astro';

export async function getStaticPaths() {
  const assetsDir = path.resolve('./src/assets');
  let results: { params: { path: string }, props: { absolutePath: string } }[] = [];
  
  async function getFiles(dir: string) {
    try {
      const items = await fs.readdir(dir, { withFileTypes: true });
      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
          await getFiles(fullPath);
        } else {
          // ignore .DS_Store or similar
          if (item.name.startsWith('.')) continue;
          
          const relPath = path.relative(assetsDir, fullPath).split(path.sep).join('/');
          results.push({
            params: { path: relPath },
            props: { absolutePath: fullPath }
          });
        }
      }
    } catch (e) {
      console.error('Error reading assets dir:', e);
    }
  }
  
  await getFiles(assetsDir);
  return results;
}

export const GET: APIRoute = async ({ props }) => {
  try {
    const data = await fs.readFile(props.absolutePath);
    const ext = path.extname(props.absolutePath).toLowerCase();
    
    let mime = 'application/octet-stream';
    if (ext === '.png') mime = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') mime = 'image/jpeg';
    else if (ext === '.webp') mime = 'image/webp';
    else if (ext === '.avif') mime = 'image/avif';
    else if (ext === '.svg') mime = 'image/svg+xml';
    else if (ext === '.gif') mime = 'image/gif';
    
    return new Response(data, {
      headers: {
        'Content-Type': mime,
        'Cache-Control': 'public, max-age=31536000',
      }
    });
  } catch (e) {
    return new Response('Not found', { status: 404 });
  }
};
