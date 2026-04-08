import { mkdir } from 'node:fs/promises';

export async function createOutputFolder(folderPath: string): Promise<void> {
  await mkdir(folderPath, { recursive: true });
}
