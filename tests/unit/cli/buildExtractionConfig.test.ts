import { describe, expect, it } from 'vitest';
import {
  buildExtractionConfig,
  DEFAULT_MAX_FRAMES
} from '../../../packages/cli/src/core/buildExtractionConfig';

describe('buildExtractionConfig', () => {
  it('caps long videos and downscales oversized footage automatically', () => {
    const config = buildExtractionConfig(
      {},
      {
        width: 3840,
        height: 2160,
        fps: 60,
        duration: 240
      }
    );

    expect(config.maxFrames).toBe(DEFAULT_MAX_FRAMES);
    expect(config.fps).toBeCloseTo(1.042, 3);
    expect(config.width).toBe(1920);
    expect(config.height).toBe(1080);
    expect(config.quality).toBe(76);
    expect(config.format).toBe('webp');
  });

  it('lets callers disable the automatic frame cap explicitly', () => {
    const config = buildExtractionConfig(
      {
        fps: 30,
        quality: 90,
        maxFrames: 0
      },
      {
        width: 1920,
        height: 1080,
        fps: 30,
        duration: 240
      }
    );

    expect(config.maxFrames).toBeUndefined();
    expect(config.fps).toBe(30);
    expect(config.quality).toBe(90);
  });
});
