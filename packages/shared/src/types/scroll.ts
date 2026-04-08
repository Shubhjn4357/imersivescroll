export type ScrollDirection = 'forward' | 'backward' | 'idle';

export interface ScrollState {
  progress: number;
  scrollY: number;
  velocity: number;
  direction: ScrollDirection;
  isScrolling: boolean;
  enabled: boolean;
  paused: boolean;
  orientation: 'vertical' | 'horizontal';
}

export interface ScrollUpdateInput {
  progress?: number;
  scrollY?: number;
  velocity?: number;
  direction?: ScrollDirection;
  isScrolling?: boolean;
}
