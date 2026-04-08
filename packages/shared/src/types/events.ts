import type { ImmersiveFrameManifest } from './manifest';
import type { ScrollDirection, ScrollState } from './scroll';

export interface ReadyEventPayload {
  manifest: ImmersiveFrameManifest | null;
}

export interface ErrorEventPayload {
  error: Error;
}

export interface ProgressEventPayload {
  progress: number;
  velocity: number;
  direction: ScrollDirection;
}

export interface FrameChangeEventPayload {
  frameIndex: number;
  totalFrames: number;
}

export interface ResizeEventPayload {
  width: number;
  height: number;
  pixelRatio: number;
}

export interface ImmersiveEventMap {
  ready: ReadyEventPayload;
  error: ErrorEventPayload;
  progress: ProgressEventPayload;
  frameChange: FrameChangeEventPayload;
  scrollStart: ScrollState;
  scrollEnd: ScrollState;
  resize: ResizeEventPayload;
  destroy: { reason: string };
}
