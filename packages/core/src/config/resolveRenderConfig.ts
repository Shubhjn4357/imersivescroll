import type { ImmersiveConfig, VisualConfig } from '@immersive-scroll/shared';

export function resolveRenderConfig(config: ImmersiveConfig): VisualConfig {
  return {
    ...config.visual,
    blur: Math.max(0, config.visual.blur),
    overlayOpacity: Math.min(1, Math.max(0, config.visual.overlayOpacity))
  };
}
