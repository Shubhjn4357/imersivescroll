import { describe, expect, it } from 'vitest';
import { useImmersiveScroll } from 'immersive-scroll';

describe('useImmersiveScroll', () => {
  it('exports a hook', () => {
    expect(typeof useImmersiveScroll).toBe('function');
  });
});
