import { describe, expect, it } from 'vitest';
import { getTriggerActivation } from '@immersive-scroll/core';

describe('getTriggerActivation', () => {
  it('detects enter and leave transitions', () => {
    expect(getTriggerActivation(0.3, 0.1, 0.2, 0.4).entered).toBe(true);
    expect(getTriggerActivation(0.5, 0.3, 0.2, 0.4).left).toBe(true);
  });
});
