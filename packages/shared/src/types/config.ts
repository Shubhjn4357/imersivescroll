import type { DeepPartial } from './utility';

export type ImmersiveMode = 'static_preextract' | 'remote_manifest';
export type RenderStrategy = 'canvas' | 'img-sequence' | 'hybrid';
export type FrameFormat = 'webp' | 'png' | 'jpg';
export type ObjectFitMode = 'cover' | 'contain' | 'fill';

export interface ScrollSpringConfig {
  enabled: boolean;
  stiffness: number;
  damping: number;
  mass: number;
  threshold: number;
}

export interface ScrollConfig {
  enabled: boolean;
  smooth: boolean;
  lerp: number;
  duration: number;
  wheelMultiplier: number;
  touchMultiplier: number;
  orientation: 'vertical' | 'horizontal';
  spring: ScrollSpringConfig;
}

export interface TriggerConfig {
  start: string;
  end: string;
  scrub: boolean | number;
  pin: boolean;
  anticipatePin: number;
  markers: boolean;
}

export interface VisualConfig {
  backgroundColor: string;
  overlayOpacity: number;
  brightness: number;
  contrast: number;
  saturate: number;
  blur: number;
  objectFit: ObjectFitMode;
  objectPosition: string;
}

export interface ScrollbarConfig {
  enabled: boolean;
  position: 'left' | 'right';
  positionMode: 'absolute' | 'fixed';
  width: number;
  radius: number;
  trackOpacity: number;
  thumbOpacity: number;
  autoHide: boolean;
  visibilityMode: 'always' | 'scroll' | 'hover' | 'manual';
  offset: number;
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  minThumbSize: number;
  trackColor: string;
  thumbColor: string;
  transitionDuration: number;
  zIndex: number;
  interactive: boolean;
}

export interface MobileConfig {
  enabled: boolean;
  reduceFrames: boolean;
  maxFrames: number;
  disableFloatingEffects: boolean;
  disablePinOnSmallScreens: boolean;
}

export interface EventCallbacks {
  onReady: ((detail: { manifestPath: string | null }) => void) | null;
  onError: ((error: Error) => void) | null;
  onProgress: ((progress: number) => void) | null;
  onFrameChange: ((frameIndex: number) => void) | null;
  onScrollStart: (() => void) | null;
  onScrollEnd: (() => void) | null;
}

export interface DebugConfig {
  enabled: boolean;
  showFrameIndex: boolean;
  showVelocity: boolean;
  showProgress: boolean;
  showManifestStatus: boolean;
}

export interface ImmersiveConfig {
  mode: ImmersiveMode;
  framesPath: string | null;
  manifestPath: string | null;
  video: string | null;
  renderStrategy: RenderStrategy;
  frameFormat: FrameFormat;
  quality: number;
  preloadCount: number;
  unloadDistance: number;
  scroll: ScrollConfig;
  trigger: TriggerConfig;
  visual: VisualConfig;
  scrollbar: ScrollbarConfig;
  mobile: MobileConfig;
  events: EventCallbacks;
  debug: DebugConfig;
}

export type PartialImmersiveConfig = DeepPartial<ImmersiveConfig>;
