import {
  createImmersiveEngine,
  createWindowScrollSync,
  resolveProgressFromScrollY
} from '@immersive-scroll/core';
import { createContainerStructure } from '../dom/createContainerStructure';
import type { CreateImmersiveInstanceOptions } from './types';

export function createImmersiveInstance({
  container,
  config,
  framesPath = null,
  manifestPath = null,
  video = null,
  plugins = []
}: CreateImmersiveInstanceOptions) {
  const { viewport, canvas, overlay, content } =
    createContainerStructure(container);

  const engine = createImmersiveEngine({
    config: {
      ...config,
      framesPath,
      manifestPath,
      video
    },
    container: viewport,
    targets: { canvas },
    plugins
  });

  void engine.init();
  const normalizedConfig = engine.config;
  const scrollSync = createWindowScrollSync({
    callbacks: {
      updateProgress(progress) {
        return engine.updateProgress(progress);
      },
      updateScroll(scrollY, velocity) {
        engine.updateScroll(scrollY, velocity);
      },
      endScroll(scrollY) {
        engine.endScroll(scrollY);
      }
    },
    resolveProgress(scrollY) {
      return resolveProgressFromScrollY(scrollY, container);
    },
    getScrollConfig() {
      return normalizedConfig.scroll;
    }
  });

  scrollSync.syncNow();

  return {
    engine,
    canvas,
    overlay,
    content,
    destroy() {
      scrollSync.destroy();
      void engine.destroy();
      canvas.remove();
      overlay.remove();
      content.remove();
    }
  };
}
