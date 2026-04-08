import type { VisualConfig } from '@immersive-scroll/shared';

export function applyCanvasFilters(
  context: CanvasRenderingContext2D,
  visualConfig: VisualConfig
) {
  context.filter = [
    `brightness(${visualConfig.brightness})`,
    `contrast(${visualConfig.contrast})`,
    `saturate(${visualConfig.saturate})`,
    `blur(${visualConfig.blur}px)`
  ].join(' ');
}
