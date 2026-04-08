import { mkdtemp, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { hashVideoSource } from '../../../packages/cli/src/core/hashVideoSource';

describe('hashVideoSource', () => {
  it('hashes file contents', async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'immersive-hash-'));
    const filePath = path.join(tempDir, 'video.bin');
    await writeFile(filePath, 'video-data');

    expect(await hashVideoSource(filePath)).toHaveLength(64);
  });
});
