import type { ExtractionConfig, VideoMetadata } from '../types';
import type { ImmersiveFrameManifest } from '@immersive-scroll/core';

export function createManifest(
  sourceVideo: string,
  videoHash: string,
  metadata: VideoMetadata,
  frameCount: number,
  config: ExtractionConfig
): ImmersiveFrameManifest {
  const outputWidth = config.width ?? metadata.width;
  const outputHeight = config.height ?? metadata.height;

  return {
    version: '1.0.0',
    videoHash,
    sourceVideo,
    frameCount,
    fps: config.fps,
    width: outputWidth,
    height: outputHeight,
    format: config.format,
    quality: config.quality,
    framePattern: `${config.prefix}-%05d.${config.format}`,
    framePrefix: config.prefix,
    generatedAt: new Date().toISOString(),
    generator: 'immersive-scroll',
    configFingerprint: `${config.fps}:${config.format}:${config.quality}:${outputWidth}x${outputHeight}`
  };
}
