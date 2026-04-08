import type { ImmersiveFrameManifest } from '@immersive-scroll/shared';

export function validateFrameDirectoryContract(
  manifest: ImmersiveFrameManifest,
  fileNames: string[]
): boolean {
  return manifest.frameCount > 0 && fileNames.length >= manifest.frameCount;
}
