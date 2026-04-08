import type { ImmersiveFrameManifest } from './manifest';
import type { Nullable } from './utility';

export interface FrameStoreState {
  currentFrame: number;
  totalFrames: number;
  frameUrl: Nullable<string>;
  manifest: Nullable<ImmersiveFrameManifest>;
  ready: boolean;
  error: Nullable<Error>;
  loadedFrames: number[];
}

export interface FrameSelectionRange {
  start: number;
  end: number;
}
