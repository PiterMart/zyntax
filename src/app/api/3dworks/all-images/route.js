import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import path from 'path';

const BASE = '3DWORKS';

async function getAllFiles(dirPath, basePath = '') {
  let results = [];
  try {
    const list = await readdir(dirPath, { withFileTypes: true });
    for (const file of list) {
      const resPath = path.join(dirPath, file.name);
      const relPath = basePath ? `${basePath}/${file.name}` : file.name;
      
      if (file.isDirectory()) {
        // Skip the eternalglory folder
        if (file.name.toLowerCase() === 'eternalglory') {
          continue;
        }
        const subResults = await getAllFiles(resPath, relPath);
        results = results.concat(subResults);
      } else {
        // Filter out non-image files if needed
        const ext = path.extname(file.name).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
          results.push(`/${BASE}/${relPath}`.replace(/\\/g, '/'));
        }
      }
    }
  } catch (error) {
    console.error('Error reading directory:', error);
  }
  return results;
}

export async function GET() {
  const publicDir = path.join(process.cwd(), 'public');
  const baseDir = path.join(publicDir, BASE);

  try {
    const images = await getAllFiles(baseDir);
    return NextResponse.json({ images });
  } catch (err) {
    console.error('Error fetching all images:', err);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}
