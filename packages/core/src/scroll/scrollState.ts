import type { ScrollState } from '@immersive-scroll/shared';

export const INITIAL_SCROLL_STATE: ScrollState = {
  progress: 0,
  scrollY: 0,
  velocity: 0,
  direction: 'idle',
  isScrolling: false,
  enabled: true,
  paused: false,
  orientation: 'vertical'
};
