import type { ImmersiveFrameManifest } from '@immersive-scroll/core';

export function printSummary(manifest: ImmersiveFrameManifest): void {
  console.log(
    JSON.stringify(
      {
        frameCount: manifest.frameCount,
        fps: manifest.fps,
        format: manifest.format,
        quality: manifest.quality,
        resolution: `${manifest.width}x${manifest.height}`,
        hash: manifest.videoHash
      },
      null,
      2
    )
  );
}
