import { clamp } from '@immersive-scroll/shared';
import type { ScrollState, ScrollUpdateInput, Subscriber, Unsubscribe } from '@immersive-scroll/shared';
import { getScrollDirection } from './scrollDirection';
import { INITIAL_SCROLL_STATE } from './scrollState';

export interface ScrollStore {
  getState(): ScrollState;
  subscribe(listener: Subscriber<ScrollState>): Unsubscribe;
  update(input: ScrollUpdateInput): void;
  pause(): void;
  resume(): void;
}

export function createScrollStore(): ScrollStore {
  let state: ScrollState = INITIAL_SCROLL_STATE;
  const listeners = new Set<Subscriber<ScrollState>>();
  const notify = () => listeners.forEach((listener) => listener(state));

  return {
    getState() {
      return state;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    update(input) {
      const velocity = input.velocity ?? state.velocity;

      state = {
        ...state,
        ...input,
        progress: clamp(input.progress ?? state.progress, 0, 1),
        velocity,
        direction: input.direction ?? getScrollDirection(velocity)
      };

      notify();
    },
    pause() {
      state = { ...state, paused: true };
      notify();
    },
    resume() {
      state = { ...state, paused: false };
      notify();
    }
  };
}
