import { describe, expect, it } from 'vitest';
import { hashString } from '@immersive-scroll/shared';

describe('hashString', () => {
  it('returns a deterministic hash for the same input', () => {
    expect(hashString('immersive')).toBe(hashString('immersive'));
  });

  it('returns different hashes for different input', () => {
    expect(hashString('immersive')).not.toBe(hashString('scroll'));
  });
});
