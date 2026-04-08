import type { ImmersiveConfig } from '../types/config';

export const DEFAULT_IMMERSIVE_CONFIG: ImmersiveConfig = {
  mode: 'static_preextract',
  framesPath: null,
  manifestPath: null,
  video: null,
  renderStrategy: 'canvas',
  frameFormat: 'webp',
  quality: 82,
  preloadCount: 6,
  unloadDistance: 20,
  scroll: {
    enabled: true,
    smooth: true,
    lerp: 0.1,
    duration: 1.2,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    orientation: 'vertical',
    spring: {
      enabled: true,
      stiffness: 120,
      damping: 24,
      mass: 1,
      threshold: 0.001
    }
  },
  trigger: {
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    pin: true,
    anticipatePin: 1,
    markers: false
  },
  visual: {
    backgroundColor: '#000000',
    overlayOpacity: 0,
    brightness: 1,
    contrast: 1,
    saturate: 1,
    blur: 0,
    objectFit: 'cover',
    objectPosition: 'center center'
  },
  scrollbar: {
    enabled: false,
    position: 'right',
    positionMode: 'absolute',
    width: 6,
    radius: 999,
    trackOpacity: 0.2,
    thumbOpacity: 0.75,
    autoHide: true,
    visibilityMode: 'always',
    offset: 16,
    minThumbSize: 72,
    trackColor: '#ffffff',
    thumbColor: '#ffffff',
    transitionDuration: 180,
    zIndex: 3,
    interactive: true
  },
  mobile: {
    enabled: true,
    reduceFrames: true,
    maxFrames: 120,
    disableFloatingEffects: false,
    disablePinOnSmallScreens: false
  },
  events: {
    onReady: null,
    onError: null,
    onProgress: null,
    onFrameChange: null,
    onScrollStart: null,
    onScrollEnd: null
  },
  debug: {
    enabled: false,
    showFrameIndex: false,
    showVelocity: false,
    showProgress: false,
    showManifestStatus: false
  }
};
