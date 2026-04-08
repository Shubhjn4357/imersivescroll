import { FRAME_FILE_PADDING, FRAME_FILE_PREFIX } from '@immersive-scroll/shared';
import type { ImmersiveFrameManifest } from '@immersive-scroll/shared';

export function resolveFrameFileName(manifest: ImmersiveFrameManifest, frameIndex: number): string {
  const numericPart = String(frameIndex + 1).padStart(FRAME_FILE_PADDING, '0');
  const prefix = manifest.framePrefix || FRAME_FILE_PREFIX;
  return `${prefix}-${numericPart}.${manifest.format}`;
}

export function resolveFrameUrl(manifest: ImmersiveFrameManifest, frameIndex: number): string {
  const basePath = (manifest.framesPath ?? '').replace(/\/$/, '');
  return `${basePath}/${resolveFrameFileName(manifest, frameIndex)}`;
}
