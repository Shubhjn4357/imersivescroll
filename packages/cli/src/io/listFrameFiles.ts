import { readdir } from 'node:fs/promises';
import path from 'node:path';

export async function listFrameFiles(folderPath: string): Promise<string[]> {
  const files = await readdir(folderPath);
  return files
    .filter((file) => /\.(webp|png|jpg)$/i.test(file))
    .map((file) => path.join(folderPath, file))
    .sort();
}
