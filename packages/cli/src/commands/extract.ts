import { listFrameFiles } from '../io/listFrameFiles';
import { buildExtractionConfig } from '../core/buildExtractionConfig';
import { cleanOutputFolder } from '../core/cleanOutputFolder';
import { createFramesIndex } from '../core/createFramesIndex';
import { createOutputFolder } from '../core/createOutputFolder';
import { extractFrames } from '../core/extractFrames';
import { hashVideoSource } from '../core/hashVideoSource';
import { loadVideoMetadata } from '../core/loadVideoMetadata';
import { printSummary } from '../core/printSummary';
import { createManifest } from '../manifest/createManifest';
import { writeManifest } from '../manifest/writeManifest';
import type { ExtractOptions } from '../types';

export async function runExtractFlow(videoPath: string, outputFolder: string, options: ExtractOptions): Promise<void> {
  const config = buildExtractionConfig(options);
  if (config.clean || config.overwrite) {
    await cleanOutputFolder(outputFolder);
  } else {
    await createOutputFolder(outputFolder);
  }

  await extractFrames(videoPath, outputFolder, config);

  const frameFiles = await listFrameFiles(outputFolder);
  const videoHash = await hashVideoSource(videoPath);
  const metadata = await loadVideoMetadata(videoPath);
  const manifest = createManifest(videoPath, videoHash, metadata, frameFiles.length, config);

  await writeManifest(outputFolder, manifest);
  await createFramesIndex(outputFolder, frameFiles);
  printSummary(manifest);
}
