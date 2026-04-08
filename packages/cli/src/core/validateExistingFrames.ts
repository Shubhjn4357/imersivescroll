import path from 'node:path';
import { validateFrameManifest } from '@immersive-scroll/core';
import { listFrameFiles } from '../io/listFrameFiles';
import { readJson } from '../io/readJson';
import type { ValidationReport } from '../types';

export async function validateExistingFrames(
  folderPath: string
): Promise<ValidationReport> {
  const manifestPath = path.join(folderPath, 'manifest.json');
  const manifestPayload = await readJson<unknown>(manifestPath);
  const validation = validateFrameManifest(manifestPayload);
  const frameFiles = await listFrameFiles(folderPath);

  if (!validation.valid || !validation.data) {
    return {
      valid: false,
      manifest: null,
      missingFrames: [],
      frameFiles
    };
  }

  const missingFrames: string[] = [];
  for (let index = 1; index <= validation.data.frameCount; index += 1) {
    const expected = `${validation.data.framePrefix}-${String(index).padStart(5, '0')}.${validation.data.format}`;
    if (!frameFiles.some((filePath) => filePath.endsWith(expected))) {
      missingFrames.push(expected);
    }
  }

  return {
    valid: missingFrames.length === 0,
    manifest: validation.data,
    missingFrames,
    frameFiles
  };
}
