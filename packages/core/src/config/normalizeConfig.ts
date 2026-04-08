import type {
  ImmersiveConfig,
  PartialImmersiveConfig
} from '@immersive-scroll/shared';
import { mergeImmersiveConfig } from './mergeConfig';
import { resolveMobileConfig } from './resolveMobileConfig';
import { resolveRenderConfig } from './resolveRenderConfig';
import { resolveScrollConfig } from './resolveScrollConfig';
import { resolveTriggerConfig } from './resolveTriggerConfig';

/** Normalize partial config into a stable runtime config. */
export function normalizeImmersiveConfig(
  input?: PartialImmersiveConfig
): ImmersiveConfig {
  const merged = mergeImmersiveConfig(input);

  return {
    ...merged,
    mobile: resolveMobileConfig(merged),
    scroll: resolveScrollConfig(merged),
    trigger: resolveTriggerConfig(merged),
    visual: resolveRenderConfig(merged)
  };
}
