import { describe, expect, it } from 'vitest';
import { validateFrameManifest } from '@immersive-scroll/shared';

describe('validateFrameManifest', () => {
  it('accepts a valid manifest shape', () => {
    const result = validateFrameManifest({
      version: '1.0.0',
      videoHash: 'abc',
      sourceVideo: 'video.mp4',
      frameCount: 10,
      fps: 30,
      width: 1920,
      height: 1080,
      format: 'webp',
      quality: 82,
      framePattern: 'frame-%05d.webp',
      framePrefix: 'frame',
      generatedAt: new Date().toISOString(),
      generator: 'immersive-scroll',
      configFingerprint: '30:webp:82'
    });

    expect(result.valid).toBe(true);
  });
});
