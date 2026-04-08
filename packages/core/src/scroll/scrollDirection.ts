import type { ScrollDirection } from '@immersive-scroll/shared';

export function getScrollDirection(velocity: number): ScrollDirection {
  if (velocity > 0) {
    return 'forward';
  }

  if (velocity < 0) {
    return 'backward';
  }

  return 'idle';
}
