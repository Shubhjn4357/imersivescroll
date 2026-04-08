import { describe, expect, it } from 'vitest';
import { useImmersiveFrame } from 'immersive-scroll';

describe('useImmersiveFrame', () => {
  it('exports a hook', () => {
    expect(typeof useImmersiveFrame).toBe('function');
  });
});
