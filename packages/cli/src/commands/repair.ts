import type { ExtractOptions } from '../types';
import { repairFrames } from '../core/repairFrames';

export async function runRepairFlow(videoPath: string, outputFolder: string, options: ExtractOptions): Promise<void> {
  await repairFrames(videoPath, outputFolder, options);
}
