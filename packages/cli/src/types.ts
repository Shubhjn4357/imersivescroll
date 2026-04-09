import type {
  FrameFormat,
  ImmersiveFrameManifest
} from '@immersive-scroll/core';

export interface ExtractOptions {
  fps?: number;
  format?: FrameFormat;
  quality?: number;
  maxFrames?: number;
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill';
  prefix?: string;
  overwrite?: boolean;
  clean?: boolean;
  silent?: boolean;
}

export interface ExtractionConfig {
  fps: number;
  format: FrameFormat;
  quality: number;
  maxFrames?: number | undefined;
  width?: number | undefined;
  height?: number | undefined;
  fit: 'cover' | 'contain' | 'fill';
  prefix: string;
  overwrite: boolean;
  clean: boolean;
  silent: boolean;
}

export interface VideoMetadata {
  width: number;
  height: number;
  fps: number;
  duration: number;
}

export interface ValidationReport {
  valid: boolean;
  manifest: ImmersiveFrameManifest | null;
  missingFrames: string[];
  frameFiles: string[];
}
