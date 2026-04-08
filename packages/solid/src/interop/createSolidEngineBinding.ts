import {
  clamp,
  createImmersiveEngine,
  normalizeImmersiveConfig
} from '@immersive-scroll/core';
import type {
  FrameStoreState,
  ImmersivePlugin,
  PartialImmersiveConfig,
  ScrollState
} from '@immersive-scroll/core';
import { createSignal, onCleanup, onMount } from 'solid-js';

export function createSolidEngineBinding(
  container: () => HTMLElement | undefined,
  viewport: () => HTMLElement | undefined,
  canvas: () => HTMLCanvasElement | undefined,
  config?: PartialImmersiveConfig,
  framesPath?: string | null,
  manifestPath?: string | null,
  video?: string | null,
  plugins: ImmersivePlugin[] = []
) {
  const normalizedConfig = normalizeImmersiveConfig({
    ...config,
    framesPath: framesPath ?? null,
    manifestPath:
      manifestPath ??
      (framesPath ? `${framesPath.replace(/\/$/, '')}/manifest.json` : null),
    video: video ?? null
  });

  const [frame, setFrame] = createSignal<FrameStoreState>({
    currentFrame: 0,
    totalFrames: 0,
    frameUrl: null,
    manifest: null,
    ready: false,
    error: null,
    loadedFrames: []
  });
  const [scroll, setScroll] = createSignal<ScrollState>({
    progress: 0,
    scrollY: 0,
    velocity: 0,
    direction: 'idle' as const,
    isScrolling: false,
    enabled: true,
    paused: false,
    orientation: 'vertical' as const
  });

  onMount(() => {
    const engine = createImmersiveEngine({
      config: normalizedConfig,
      container: viewport() ?? null,
      targets: { canvas: canvas() ?? null },
      plugins
    });

    const unsubscribeFrame = engine.subscribeFrame((value) => setFrame(value));
    const unsubscribeScroll = engine.subscribeScroll((value) =>
      setScroll(value)
    );

    void engine.init();

    let animationFrameId = 0;
    let scrollIdleTimeout = 0;
    let lastScrollY = window.scrollY;
    let lastTimestamp = performance.now();

    const syncScrollState = () => {
      animationFrameId = 0;

      const currentScrollY = window.scrollY;
      const currentTimestamp = performance.now();
      const containerElement = container();
      const containerRect = containerElement?.getBoundingClientRect();
      const containerTop = containerRect
        ? currentScrollY + containerRect.top
        : 0;
      const containerHeight =
        containerRect?.height ?? document.documentElement.scrollHeight;
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

    onCleanup(() => {
      window.removeEventListener('scroll', queueScrollSync);
      window.removeEventListener('resize', queueScrollSync);
      window.cancelAnimationFrame(animationFrameId);
      window.clearTimeout(scrollIdleTimeout);
      unsubscribeFrame();
      unsubscribeScroll();
      void engine.destroy();
    });
  });

  return {
    config: () => normalizedConfig,
    frame,
    scroll
  };
}
