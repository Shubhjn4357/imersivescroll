import type { ExtractionConfig, VideoMetadata } from '../types';
import type { ImmersiveFrameManifest } from '@immersive-scroll/core';

export function createManifest(
  sourceVideo: string,
  videoHash: string,
  metadata: VideoMetadata,
  frameCount: number,
  config: ExtractionConfig
): ImmersiveFrameManifest {
  return {
    version: '1.0.0',
    videoHash,
    sourceVideo,
    frameCount,
    fps: config.fps,
    width: config.width ?? metadata.width,
    height: config.height ?? metadata.height,
    format: config.format,
    quality: config.quality,
    framePattern: `${config.prefix}-%05d.${config.format}`,
    framePrefix: config.prefix,
    generatedAt: new Date().toISOString(),
    generator: 'immersive-scroll',
    configFingerprint: `${config.fps}:${config.format}:${config.quality}`
  };
}
