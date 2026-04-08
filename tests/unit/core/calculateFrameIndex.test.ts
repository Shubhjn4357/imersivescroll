import { describe, expect, it } from 'vitest';
import { calculateFrameIndexFromProgress } from '@immersive-scroll/core';

describe('calculateFrameIndexFromProgress', () => {
  it('maps progress into the available frame range', () => {
    expect(calculateFrameIndexFromProgress(0, 10)).toBe(0);
    expect(calculateFrameIndexFromProgress(0.5, 10)).toBe(5);
    expect(calculateFrameIndexFromProgress(1, 10)).toBe(9);
  });
});
