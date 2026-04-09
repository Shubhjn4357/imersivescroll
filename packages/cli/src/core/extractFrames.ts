import { spawn } from 'node:child_process';
import path from 'node:path';
import ffmpegPath from 'ffmpeg-static';
import type { ExtractionConfig } from '../types';

function resolveJpegQuality(quality: number) {
  return String(
    Math.max(2, Math.min(31, Math.round(31 - (quality / 100) * 29)))
  );
}

export async function extractFrames(
  videoPath: string,
  outputFolder: string,
  config: ExtractionConfig
): Promise<void> {
  const outputPattern = path.join(
    outputFolder,
    `${config.prefix}-%05d.${config.format}`
  );
  const scaleFilter =
    config.width && config.height
      ? `scale=${config.width}:${config.height}:flags=lanczos`
      : config.width
        ? `scale=${config.width}:-2:flags=lanczos`
        : config.height
          ? `scale=-2:${config.height}:flags=lanczos`
          : null;
  const filter = [scaleFilter, `fps=${config.fps}:round=down`]
    .filter(Boolean)
    .join(',');
  const codecArgs =
    config.format === 'webp'
      ? [
          '-an',
          '-c:v',
          'libwebp',
          '-quality',
          String(config.quality),
          '-compression_level',
          '4'
        ]
      : config.format === 'png'
        ? ['-an']
        : ['-an', '-q:v', resolveJpegQuality(config.quality)];
  const args = [
    '-y',
    '-i',
    videoPath,
    '-vf',
    filter,
    ...codecArgs,
    outputPattern
  ];

  await new Promise<void>((resolve, reject) => {
    const processHandle = spawn(ffmpegPath ?? 'ffmpeg', args, {
      stdio: 'inherit'
    });
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
