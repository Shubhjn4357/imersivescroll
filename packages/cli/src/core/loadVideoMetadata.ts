import { spawn } from 'node:child_process';
import ffmpegPath from 'ffmpeg-static';
import type { VideoMetadata } from '../types';

export async function loadVideoMetadata(videoPath: string): Promise<VideoMetadata> {
  const output = await new Promise<string>((resolve, reject) => {
    const child = spawn(ffmpegPath ?? 'ffmpeg', ['-i', videoPath]);
    let stderr = '';

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', reject);
    child.on('exit', () => resolve(stderr));
  });

  const durationMatch = output.match(/Duration:\\s+(\\d+):(\\d+):(\\d+\\.\\d+)/);
  const streamMatch = output.match(/Video:.*?,\\s+(\\d+)x(\\d+).*?(\\d+(?:\\.\\d+)?)\\s+fps/);

  if (!durationMatch || !streamMatch) {
    throw new Error('Unable to parse video metadata from ffmpeg output.');
  }

  const [, hours, minutes, seconds] = durationMatch;
  const [, width, height, fps] = streamMatch;

  return {
    width: Number(width),
    height: Number(height),
    fps: Number(fps),
    duration: Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds)
  };
}
