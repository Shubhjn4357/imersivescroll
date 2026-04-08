import type { ImmersiveConfig } from './config';

export type RendererStrategy = ImmersiveConfig['renderStrategy'];

export interface RenderFrameInput {
  frameIndex: number;
  image: HTMLImageElement | ImageBitmap | null;
}

export interface ImmersiveRenderer {
  readonly strategy: RendererStrategy;
  mount(): void;
  resize(width: number, height: number, pixelRatio: number): void;
  render(input: RenderFrameInput): void;
  destroy(): void;
}
