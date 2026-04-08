import { describe, expect, it } from 'vitest';
import { normalizeImmersiveConfig } from '@immersive-scroll/core';

describe('normalizeImmersiveConfig', () => {
  it('fills required defaults for partial config input', () => {
    const config = normalizeImmersiveConfig({ scrollbar: { enabled: true } });

    expect(config.mode).toBe('static_preextract');
    expect(config.scrollbar.enabled).toBe(true);
    expect(config.renderStrategy).toBe('canvas');
  });
});
