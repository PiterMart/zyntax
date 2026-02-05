import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import path from 'path';

const BASE = '3DWORKS';

function resolvePath(pathParam) {
  const publicDir = path.join(process.cwd(), 'public');
  const baseDir = path.join(publicDir, BASE);
  const raw = pathParam ? pathParam.replace(/\//g, path.sep) : '';
  const resolved = path.join(baseDir, raw);
  const normalized = path.normalize(resolved);
  if (!normalized.startsWith(baseDir)) return null;
  return normalized;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pathParam = searchParams.get('path') ?? '';

  if (pathParam.includes('..')) {
    return NextResponse.json(
      { error: 'Invalid or missing path parameter' },
      { status: 400 }
    );
  }

  const dirPath = resolvePath(pathParam);
  if (!dirPath) {
    return NextResponse.json(
      { error: 'Invalid path' },
      { status: 400 }
    );
  }

  try {
    const entries = await readdir(dirPath, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .sort();

    const basePath = `/${BASE}/${pathParam.replace(/\\/g, '/')}/`.replace(/\/+/g, '/');
    return NextResponse.json({ basePath, files });
  } catch (err) {
    console.error('Error reading folder:', err);
    return NextResponse.json(
      { error: 'Failed to read folder contents' },
      { status: 500 }
    );
  }
}
