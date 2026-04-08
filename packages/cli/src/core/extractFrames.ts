import { spawn } from 'node:child_process';
import path from 'node:path';
import ffmpegPath from 'ffmpeg-static';
import type { ExtractionConfig } from '../types';

export async function extractFrames(videoPath: string, outputFolder: string, config: ExtractionConfig): Promise<void> {
  const outputPattern = path.join(outputFolder, `${config.prefix}-%05d.${config.format}`);
  const scaleFilter =
    config.width && config.height
      ? `scale=${config.width}:${config.height}:force_original_aspect_ratio=decrease`
      : config.width
        ? `scale=${config.width}:-2`
        : config.height
          ? `scale=-2:${config.height}`
          : null;
  const filter = [scaleFilter, `fps=${config.fps}`].filter(Boolean).join(',');
  const args = ['-y', '-i', videoPath, '-vf', filter, outputPattern];

  await new Promise<void>((resolve, reject) => {
    const processHandle = spawn(ffmpegPath ?? 'ffmpeg', args, { stdio: 'inherit' });
    processHandle.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`ffmpeg exited with code ${code ?? 1}`));
      }
    });
    processHandle.on('error', reject);
  });
}
