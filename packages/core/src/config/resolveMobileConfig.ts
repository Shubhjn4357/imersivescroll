import type { ImmersiveConfig, MobileConfig } from '@immersive-scroll/shared';

export function resolveMobileConfig(config: ImmersiveConfig): MobileConfig {
  if (typeof window === 'undefined' || !config.mobile.enabled) {
    return config.mobile;
  }

  const isSmallScreen = window.innerWidth <= 768;
  if (!isSmallScreen) {
    return config.mobile;
  }

  return {
    ...config.mobile,
    maxFrames: Math.min(config.mobile.maxFrames, 120)
  };
}
