import type { ExtractOptions } from '../types';
import { cleanOutputFolder } from './cleanOutputFolder';
import { runExtractFlow } from '../commands/extract';

export async function repairFrames(
  videoPath: string,
  outputFolder: string,
  options: ExtractOptions
): Promise<void> {
  await cleanOutputFolder(outputFolder);
  await runExtractFlow(videoPath, outputFolder, options);
}
