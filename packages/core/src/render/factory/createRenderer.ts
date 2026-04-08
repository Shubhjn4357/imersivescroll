import type {
  ImmersiveConfig,
  ImmersiveRenderer
} from '@immersive-scroll/shared';
import { createCanvasRenderer } from '../canvas/createCanvasRenderer';
import { createImageSequenceRenderer } from '../dom/createImageSequenceRenderer';

export interface RendererTargets {
  canvas?: HTMLCanvasElement | null;
  image?: HTMLImageElement | null;
}

export function createRenderer(
  config: ImmersiveConfig,
  targets: RendererTargets
): ImmersiveRenderer | null {
  if (
    (config.renderStrategy === 'canvas' ||
      config.renderStrategy === 'hybrid') &&
    targets.canvas
  ) {
    return createCanvasRenderer(targets.canvas, config.visual);
  }

  if (targets.image) {
    return createImageSequenceRenderer(targets.image, config.visual);
  }

  return null;
}
