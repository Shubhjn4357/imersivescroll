import { rm } from 'node:fs/promises';

export async function removeDir(directoryPath: string): Promise<void> {
  await rm(directoryPath, { recursive: true, force: true });
}
