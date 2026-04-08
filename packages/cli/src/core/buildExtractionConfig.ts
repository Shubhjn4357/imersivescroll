import type { ExtractOptions, ExtractionConfig } from '../types';

export function buildExtractionConfig(options: ExtractOptions): ExtractionConfig {
  return {
    fps: options.fps ?? 30,
    format: options.format ?? 'webp',
    quality: options.quality ?? 82,
    width: options.width,
    height: options.height,
    fit: options.fit ?? 'cover',
    prefix: options.prefix ?? 'frame',
    overwrite: options.overwrite ?? false,
    clean: options.clean ?? false,
    silent: options.silent ?? false
  };
}
