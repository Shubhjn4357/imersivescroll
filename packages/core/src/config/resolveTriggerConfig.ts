import type { ImmersiveConfig, TriggerConfig } from '@immersive-scroll/shared';

export function resolveTriggerConfig(config: ImmersiveConfig): TriggerConfig {
  return config.trigger;
}
