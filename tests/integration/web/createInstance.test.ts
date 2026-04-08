import { describe, expect, it } from 'vitest';
import { createImmersiveInstance } from '@immersive-scroll/web';

describe('createImmersiveInstance', () => {
  it('exports an imperative factory', () => {
    expect(typeof createImmersiveInstance).toBe('function');
  });
});
