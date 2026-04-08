import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { validateExistingFrames } from '../../../packages/cli/src/core/validateExistingFrames';

describe('validateExistingFrames', () => {
  it('reports a valid directory when all frames exist', async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'immersive-validate-'));
    await mkdir(tempDir, { recursive: true });
    await writeFile(
      path.join(tempDir, 'manifest.json'),
      JSON.stringify({
        version: '1.0.0',
        videoHash: 'hash',
        sourceVideo: 'video.mp4',
        frameCount: 1,
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
      })
    );
    await writeFile(path.join(tempDir, 'frame-00001.webp'), '');

    const result = await validateExistingFrames(tempDir);
    expect(result.valid).toBe(true);
  });
});
