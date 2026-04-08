import { describe, expect, it } from 'vitest';
import { createManifest } from '../../../packages/cli/src/manifest/createManifest';

describe('createManifest', () => {
  it('creates a deterministic manifest payload', () => {
    const manifest = createManifest(
      'video.mp4',
      'hash',
      { width: 1920, height: 1080, fps: 30, duration: 10 },
      120,
      { fps: 30, format: 'webp', quality: 82, fit: 'cover', prefix: 'frame', overwrite: false, clean: false, silent: false }
    );

    expect(manifest.frameCount).toBe(120);
    expect(manifest.framePrefix).toBe('frame');
  });
});
