import { describe, expect, it } from 'vitest';
import { createScrollStore } from '@immersive-scroll/core';

describe('createScrollStore', () => {
  it('updates progress and direction', () => {
    const store = createScrollStore();
    store.update({ progress: 0.5, velocity: 10 });

    expect(store.getState().progress).toBe(0.5);
    expect(store.getState().direction).toBe('forward');
  });
});
