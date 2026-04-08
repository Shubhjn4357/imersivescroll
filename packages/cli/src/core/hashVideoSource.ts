import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

export async function hashVideoSource(videoPath: string): Promise<string> {
  const buffer = await readFile(videoPath);
  return createHash('sha256').update(buffer).digest('hex');
}
