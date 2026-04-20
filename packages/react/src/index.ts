export { ImmersiveCanvas } from './components/ImmersiveCanvas';
export { ImmersiveDebugPanel } from './components/ImmersiveDebugPanel';
export { ImmersiveFloating } from './components/ImmersiveFloating';
export { ImmersiveLayer } from './components/ImmersiveLayer';
export { ImmersiveScroll } from './components/ImmersiveScroll';
export { ImmersiveScrollbar } from './components/ImmersiveScrollbar';
export { ImmersiveTriggerZone } from './components/ImmersiveTriggerZone';
export {
  ImmersiveScrollytelling,
  type ImmersiveScrollytellingProps,
  type ScrollytellingStep
} from './components/ImmersiveScrollytelling';
export { ImmersiveScrollProvider } from './context/ImmersiveScrollProvider';
export { createGsapTimeline } from './gsap/createGsapTimeline';
export { registerGsapPlugins } from './gsap/registerGsapPlugins';
export { setupScrollTrigger } from './gsap/setupScrollTrigger';
export { useImmersiveConfig } from './hooks/useImmersiveConfig';
export {
  useImmersiveConfigControls,
  type ImmersiveConfigControls,
  type UseImmersiveConfigControlsOptions
} from './hooks/useImmersiveConfigControls';
export { useImmersiveContext } from './hooks/useImmersiveContext';
export { useImmersiveFrame } from './hooks/useImmersiveFrame';
export { useImmersiveMotionValue } from './hooks/useImmersiveMotionValue';
export { useImmersivePlugins } from './hooks/useImmersivePlugins';
export { useImmersiveProgress } from './hooks/useImmersiveProgress';
export { useImmersiveScroll } from './hooks/useImmersiveScroll';
export { useImmersiveScrollbar } from './hooks/useImmersiveScrollbar';
export { useScrollTriggerSetup } from './hooks/useScrollTriggerSetup';
export { useImmersiveTimeline } from './hooks/useImmersiveTimeline';
export { useImmersiveTrigger } from './hooks/useImmersiveTrigger';
export { useImmersiveVelocity } from './hooks/useImmersiveVelocity';
export {
  DEFAULT_IMMERSIVE_CONFIG,
  clamp,
  deepMerge
} from '@immersive-scroll/shared';
export type {
  DebugConfig,
  EventCallbacks,
  ImmersiveConfig,
  ImmersiveFrameManifest,
  MobileConfig,
  ObjectFitMode,
  PartialImmersiveConfig,
  ScrollConfig,
  ScrollbarConfig,
  TriggerConfig,
  VisualConfig
} from '@immersive-scroll/shared';
export type * from './types/component-props';
