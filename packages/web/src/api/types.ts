import type { ImmersivePlugin, PartialImmersiveConfig } from '@immersive-scroll/core';

export interface CreateImmersiveInstanceOptions {
  container: HTMLElement;
  framesPath?: string | null;
  manifestPath?: string | null;
  video?: string | null;
  config?: PartialImmersiveConfig;
  plugins?: ImmersivePlugin[];
}
