import type { ExtractOptions, ExtractionConfig, VideoMetadata } from '../types';

export const DEFAULT_MAX_FRAMES = 250;
const DEFAULT_MAX_LONG_EDGE = 1920;

function resolveAutoFps(sourceFps: number) {
  if (sourceFps >= 29.5) {
    return 30;
  }

  if (sourceFps >= 23.5) {
    return 24;
  }

  return Math.max(12, Math.round(sourceFps));
}

function roundEven(value: number) {
  return Math.max(2, Math.round(value / 2) * 2);
}

function roundPrecision(value: number) {
  return Number(value.toFixed(3));
}

function resolveMaxFrames(requestedMaxFrames?: number) {
  if (requestedMaxFrames === undefined) {
    return DEFAULT_MAX_FRAMES;
  }

  if (!Number.isFinite(requestedMaxFrames) || requestedMaxFrames <= 0) {
    return null;
  }

  return Math.max(1, Math.round(requestedMaxFrames));
}

function resolveOutputSize(
  metadata: VideoMetadata,
  options: ExtractOptions
): Pick<ExtractionConfig, 'width' | 'height'> {
  if (options.width && options.height) {
    return {
      width: roundEven(options.width),
      height: roundEven(options.height)
    };
  }

  if (options.width) {
    return {
      width: roundEven(options.width),
      height: roundEven((metadata.height / metadata.width) * options.width)
    };
  }

  if (options.height) {
    return {
      width: roundEven((metadata.width / metadata.height) * options.height),
      height: roundEven(options.height)
    };
  }

  const longEdge = Math.max(metadata.width, metadata.height);
  if (longEdge <= DEFAULT_MAX_LONG_EDGE) {
    return {
      width: metadata.width,
      height: metadata.height
    };
  }

  const scale = DEFAULT_MAX_LONG_EDGE / longEdge;
  return {
    width: roundEven(metadata.width * scale),
    height: roundEven(metadata.height * scale)
  };
}

function resolveTargetFps(
  metadata: VideoMetadata,
  requestedFps: number | undefined,
  maxFrames: number | null
) {
  const baseFps = requestedFps ?? resolveAutoFps(metadata.fps);
  if (maxFrames === null) {
    return roundPrecision(baseFps);
  }

  const duration = Math.max(metadata.duration, 0.001);
  const limitedFps = Math.max(maxFrames / duration, 1 / duration);
  return roundPrecision(Math.min(baseFps, limitedFps));
}

function estimateFrameCount(metadata: VideoMetadata, fps: number) {
  return Math.max(1, Math.floor(metadata.duration * fps));
}

function resolveAutoQuality(
  width: number,
  height: number,
  estimatedFrameCount: number
) {
  const pixelBudget = width * height * estimatedFrameCount;

  if (pixelBudget >= 1_000_000_000) {
    return 68;
  }

  if (pixelBudget >= 700_000_000) {
    return 72;
  }

  if (pixelBudget >= 400_000_000) {
    return 76;
  }

  if (pixelBudget >= 220_000_000) {
    return 80;
  }

  return 82;
}

export function buildExtractionConfig(
  options: ExtractOptions,
  metadata: VideoMetadata
): ExtractionConfig {
  const maxFrames = resolveMaxFrames(options.maxFrames);
  const outputSize = resolveOutputSize(metadata, options);
  const fps = resolveTargetFps(metadata, options.fps, maxFrames);
  const estimatedFrameCount = estimateFrameCount(metadata, fps);
  const width = outputSize.width ?? metadata.width;
  const height = outputSize.height ?? metadata.height;

  return {
    fps,
    format: options.format ?? 'webp',
    quality:
      options.quality ?? resolveAutoQuality(width, height, estimatedFrameCount),
    maxFrames: maxFrames ?? undefined,
    width,
    height,
    fit: options.fit ?? 'cover',
    prefix: options.prefix ?? 'frame',
    overwrite: options.overwrite ?? false,
    clean: options.clean ?? false,
    silent: options.silent ?? false
  };
}
