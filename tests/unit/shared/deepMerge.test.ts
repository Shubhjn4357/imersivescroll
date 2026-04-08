import { describe, expect, it } from 'vitest';
import { deepMerge } from '@immersive-scroll/shared';

describe('deepMerge', () => {
  it('merges nested objects without dropping sibling keys', () => {
    expect(
      deepMerge(
        { visual: { brightness: 1, contrast: 1 }, debug: { enabled: false } },
        { visual: { brightness: 1.25 } }
      )
    ).toEqual({
      visual: { brightness: 1.25, contrast: 1 },
      debug: { enabled: false }
    });
  });
});
