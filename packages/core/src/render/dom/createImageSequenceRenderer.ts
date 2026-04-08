import type { ImmersiveRenderer, RenderFrameInput, VisualConfig } from '@immersive-scroll/shared';

export function createImageSequenceRenderer(element: HTMLImageElement, config: VisualConfig): ImmersiveRenderer {
  return {
    strategy: 'img-sequence',
    mount() {
      element.style.objectFit = config.objectFit;
      element.style.objectPosition = config.objectPosition;
      element.style.backgroundColor = config.backgroundColor;
    },
    resize() {},
    render(input: RenderFrameInput) {
      if (input.image instanceof HTMLImageElement) {
        element.src = input.image.src;
      }
    },
    destroy() {
      element.removeAttribute('src');
    }
  };
}
