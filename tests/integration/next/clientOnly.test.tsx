import { describe, expect, it } from 'vitest';
import { withImmersiveClientOnly } from '@immersive-scroll/next';

describe('withImmersiveClientOnly', () => {
  it('exports a wrapper function', () => {
    expect(typeof withImmersiveClientOnly).toBe('function');
  });
});
