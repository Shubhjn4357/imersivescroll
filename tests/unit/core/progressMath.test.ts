import { describe, expect, it } from 'vitest';
import { normalizeProgress, segmentProgress } from '@immersive-scroll/core';

describe('progressMath', () => {
  it('clamps progress between 0 and 1', () => {
    expect(normalizeProgress(-1)).toBe(0);
    expect(normalizeProgress(2)).toBe(1);
  });

  it('returns segment progress', () => {
    expect(segmentProgress(0.5, 0.25, 0.75)).toBe(0.5);
  });
});
