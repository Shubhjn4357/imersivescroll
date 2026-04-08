import { createImmersiveEngine } from '@immersive-scroll/core';
import { clamp } from '@immersive-scroll/core';
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

  let animationFrameId = 0;
  let scrollIdleTimeout = 0;
  let lastScrollY = window.scrollY;
  let lastTimestamp = performance.now();

  const syncScrollState = () => {
    animationFrameId = 0;

    const currentScrollY = window.scrollY;
    const currentTimestamp = performance.now();
    const containerRect = container.getBoundingClientRect();
    const containerTop = currentScrollY + containerRect.top;
    const containerHeight = containerRect.height;
    const componentScrollRange = containerHeight - window.innerHeight;
    const globalScrollRange = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1
    );
    const progress =
      componentScrollRange > 1
        ? clamp((currentScrollY - containerTop) / componentScrollRange, 0, 1)
        : clamp(currentScrollY / globalScrollRange, 0, 1);
    const deltaY = currentScrollY - lastScrollY;
    const deltaTime = Math.max(currentTimestamp - lastTimestamp, 16);
    const velocity = deltaY / deltaTime;

    lastScrollY = currentScrollY;
    lastTimestamp = currentTimestamp;

    void engine.updateProgress(progress);
    engine.updateScroll(currentScrollY, velocity);

    window.clearTimeout(scrollIdleTimeout);
    scrollIdleTimeout = window.setTimeout(() => {
      engine.endScroll(window.scrollY);
    }, 96);
  };

  const queueScrollSync = () => {
    if (animationFrameId !== 0) {
      return;
    }

    animationFrameId = window.requestAnimationFrame(syncScrollState);
  };

  window.addEventListener('scroll', queueScrollSync, { passive: true });
  window.addEventListener('resize', queueScrollSync);
  queueScrollSync();

  return {
    engine,
    canvas,
    overlay,
    content,
    destroy() {
      window.removeEventListener('scroll', queueScrollSync);
      window.removeEventListener('resize', queueScrollSync);
      window.cancelAnimationFrame(animationFrameId);
      window.clearTimeout(scrollIdleTimeout);
      void engine.destroy();
      canvas.remove();
      overlay.remove();
      content.remove();
    }
  };
}
