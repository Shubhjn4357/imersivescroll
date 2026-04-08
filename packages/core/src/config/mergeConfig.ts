import {
  DEFAULT_IMMERSIVE_CONFIG,
  deepMerge,
  validateConfig
} from '@immersive-scroll/shared';
import type {
  ImmersiveConfig,
  PartialImmersiveConfig
} from '@immersive-scroll/shared';

/** Merge user config into the shared default config. */
export function mergeImmersiveConfig(
  input?: PartialImmersiveConfig
): ImmersiveConfig {
  const merged = deepMerge(DEFAULT_IMMERSIVE_CONFIG, input);
  const validation = validateConfig(merged);
  return validation.data ?? DEFAULT_IMMERSIVE_CONFIG;
}
