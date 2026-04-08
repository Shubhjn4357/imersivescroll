import { clamp } from '@immersive-scroll/shared';

export function normalizeProgress(value: number): number {
  return clamp(value, 0, 1);
}

export function segmentProgress(
  progress: number,
  start: number,
  end: number
): number {
  if (end <= start) {
    return 0;
  }

  return clamp((progress - start) / (end - start), 0, 1);
}
