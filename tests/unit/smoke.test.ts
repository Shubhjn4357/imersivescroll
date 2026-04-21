import { describe, it, expect } from 'vitest';
import { deepMerge } from '@immersive-scroll/shared';
// Import from core to verify alias resolution
// import { ... } from '@immersive-scroll/core';

describe('Smoke Test - Unit', () => {
  it('should resolve workspace packages', () => {
    const target = { a: 1 };
    const source = { b: 2 };
    expect(deepMerge(target, source)).toEqual({ a: 1, b: 2 });
  });

  it('should perform basic assertions', () => {
    expect(1 + 1).toBe(2);
  });
});
