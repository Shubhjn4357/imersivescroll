import type {
  ImmersiveRenderer,
  RenderFrameInput,
  VisualConfig
} from '@immersive-scroll/shared';
import { applyCanvasFilters } from './applyCanvasFilters';
import { drawFrameToCanvas } from './drawFrameToCanvas';
import { resizeCanvas } from './resizeCanvas';

export function createCanvasRenderer(
  canvas: HTMLCanvasElement,
  visualConfig: VisualConfig
): ImmersiveRenderer {
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas 2D context is required.');
  }

  let viewportWidth = 0;
  let viewportHeight = 0;

  return {
    strategy: 'canvas',
    mount() {
      canvas.style.backgroundColor = visualConfig.backgroundColor;
    },
    resize(width, height, pixelRatio) {
      viewportWidth = width;
      viewportHeight = height;
      resizeCanvas(canvas, context, width, height, pixelRatio);
      applyCanvasFilters(context, visualConfig);
    },
    render(input: RenderFrameInput) {
      context.clearRect(0, 0, viewportWidth, viewportHeight);
      if (!input.image) {
        return;
      }

      drawFrameToCanvas({
        context,
        image: input.image,
        canvasWidth: viewportWidth,
        canvasHeight: viewportHeight,
        objectFit: visualConfig.objectFit,
        objectPosition: visualConfig.objectPosition
      });
    },
    destroy() {
      context.clearRect(0, 0, viewportWidth, viewportHeight);
    }
  };
}
