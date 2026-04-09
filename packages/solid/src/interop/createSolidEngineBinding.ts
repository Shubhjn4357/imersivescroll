import {
  createWindowScrollSync,
  createImmersiveEngine,
  normalizeImmersiveConfig,
  resolveProgressFromScrollY
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
        return resolveProgressFromScrollY(scrollY, container() ?? null);
      },
      getScrollConfig() {
        return normalizedConfig.scroll;
      }
    });

    scrollSync.syncNow();

    onCleanup(() => {
      scrollSync.destroy();
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
