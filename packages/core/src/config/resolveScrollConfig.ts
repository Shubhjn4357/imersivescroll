import type { ImmersiveConfig, ScrollConfig } from '@immersive-scroll/shared';

export function resolveScrollConfig(config: ImmersiveConfig): ScrollConfig {
  return config.scroll;
}
