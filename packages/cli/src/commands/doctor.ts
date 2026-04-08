import os from 'node:os';
import { spawnSync } from 'node:child_process';
import ffmpegPath from 'ffmpeg-static';

export function runDoctorFlow(): void {
  const ffmpeg = spawnSync(ffmpegPath ?? 'ffmpeg', ['-version']);

  console.log(
    JSON.stringify(
      {
        node: process.version,
        platform: process.platform,
        tempDirectory: os.tmpdir(),
        ffmpegAvailable: ffmpeg.status === 0,
        ffmpegPath: ffmpegPath ?? 'ffmpeg'
      },
      null,
      2
    )
  );
}
