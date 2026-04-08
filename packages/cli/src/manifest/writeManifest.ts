import path from 'node:path';
import type { ImmersiveFrameManifest } from '@immersive-scroll/core';
import { writeJson } from '../io/writeJson';

export async function writeManifest(
  folderPath: string,
  manifest: ImmersiveFrameManifest
): Promise<void> {
  await writeJson(path.join(folderPath, 'manifest.json'), manifest);
}
