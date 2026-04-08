import { clamp } from '@immersive-scroll/shared';

/** Map normalized progress to a stable zero-based frame index. */
export function calculateFrameIndexFromProgress(progress: number, frameCount: number): number {
  if (frameCount <= 1) {
    return 0;
  }

  return Math.round(clamp(progress, 0, 1) * (frameCount - 1));
}
