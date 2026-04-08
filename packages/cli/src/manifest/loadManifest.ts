import path from 'node:path';
import type { ImmersiveFrameManifest } from '@immersive-scroll/core';
import { readJson } from '../io/readJson';

export async function loadManifest(
  folderPath: string
): Promise<ImmersiveFrameManifest> {
  return readJson<ImmersiveFrameManifest>(
    path.join(folderPath, 'manifest.json')
  );
}
