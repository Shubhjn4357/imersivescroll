import type {
  ImmersiveEngineContext,
  ImmersiveFrameManifest,
  ImmersivePlugin,
  PartialImmersiveConfig
} from '@immersive-scroll/shared';
import { toError } from '@immersive-scroll/shared';
import { normalizeImmersiveConfig } from '../config/normalizeConfig';
import { createEventBus } from '../events/createEventBus';
import { calculateFrameIndexFromProgress } from '../frame/calculateFrameIndex';
import { createFrameStore } from '../frame/createFrameStore';
import { resolveFrameUrl } from '../frame/frameManifest';
import {
  evictFrameImage,
  loadFrameImage,
  primeFrameImage
} from '../frame/loadFrameImage';
import { loadManifest } from '../manifest/loadManifest';
import { resolveManifestPath } from '../manifest/resolveManifestPath';
import { createPluginManager } from '../plugins/createPluginManager';
import { createProgressController } from '../progress/createProgressController';
import {
  createRenderer,
  type RendererTargets
} from '../render/factory/createRenderer';
import { createResizeController } from '../resize/createResizeController';
import { createScrollStore } from '../scroll/createScrollStore';
import { createTimelineRegistry } from '../timeline/createTimelineRegistry';
import { createViewportObserver } from '../viewport/createViewportObserver';

export interface CreateImmersiveEngineOptions {
  config?: PartialImmersiveConfig;
  container?: HTMLElement | null;
  targets?: RendererTargets;
  plugins?: ImmersivePlugin[];
  manifest?: ImmersiveFrameManifest | null;
}

/** Create the framework-agnostic immersive engine. */
export function createImmersiveEngine(
  options: CreateImmersiveEngineOptions = {}
) {
  const config = normalizeImmersiveConfig(options.config);
  const frameStore = createFrameStore();
  const scrollStore = createScrollStore();
  const timelineRegistry = createTimelineRegistry();
  const eventBus = createEventBus();
  const renderer = createRenderer(config, options.targets ?? {});
  const viewportObserver = createViewportObserver(options.container ?? null);
  const resizeController = createResizeController(options.container ?? null);
  const progressController = createProgressController();
  const loadedFrameIndexes = new Set<number>();
  let animationFrameId = 0;
  let lastStepTimestamp = 0;
  let lastRenderRequest = 0;
  let destroyed = false;

  let context: ImmersiveEngineContext = {
    config,
    eventBus,
    scrollStore,
    frameStore,
    timelineRegistry,
    viewport: viewportObserver.getSnapshot(),
    container: options.container ?? null,
    renderer
  };

  const pluginManager = createPluginManager(options.plugins ?? [], context);

  const syncToProgress = async (progress: number) => {
    const totalFrames =
      frameStore.getState().totalFrames ||
      frameStore.getState().manifest?.frameCount ||
      1;
    const frameIndex = calculateFrameIndexFromProgress(progress, totalFrames);

    scrollStore.update({ progress });
    frameStore.setCurrentFrame(frameIndex);

    const manifest = frameStore.getState().manifest;
    config.events.onProgress?.(progress);
    config.events.onFrameChange?.(frameIndex);
    eventBus.emit('frameChange', { frameIndex, totalFrames });
    await pluginManager.onFrameChange(frameIndex);

    if (manifest) {
      void preloadFrameWindow(manifest, frameIndex);
    }

    await renderCurrentFrame();
  };

  const step = async (timestamp: number) => {
    if (destroyed) {
      return;
    }

    const deltaTime = lastStepTimestamp ? timestamp - lastStepTimestamp : 16;
    lastStepTimestamp = timestamp;

    const previousProgress = progressController.getProgress();
    const nextProgress = progressController.step(deltaTime, config.scroll);

    if (Math.abs(nextProgress - previousProgress) > 0.00001) {
      await syncToProgress(nextProgress);
    }

    animationFrameId = window.requestAnimationFrame(step);
  };

  const startLoop = () => {
    if (animationFrameId !== 0) {
      return;
    }
    lastStepTimestamp = performance.now();
    animationFrameId = window.requestAnimationFrame(step);
  };

  const stopLoop = () => {
    if (animationFrameId !== 0) {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
    }
  };

  const viewportUnsubscribe = viewportObserver.subscribe((viewport) => {
    context = { ...context, viewport };
    renderer?.resize(viewport.width, viewport.height, viewport.pixelRatio);
    eventBus.emit('resize', viewport);
    void pluginManager.onResize();
  });

  const scrollUnsubscribe = scrollStore.subscribe((scroll) => {
    eventBus.emit('progress', {
      progress: scroll.progress,
      velocity: scroll.velocity,
      direction: scroll.direction
    });
    void pluginManager.onScroll();
  });

  const setManifest = async (manifest: ImmersiveFrameManifest | null) => {
    loadedFrameIndexes.clear();
    frameStore.setManifest(manifest);
    frameStore.setLoadedFrames([]);
    if (!manifest) {
      return;
    }

    eventBus.emit('ready', { manifest });
    config.events.onReady?.({ manifestPath: resolveManifestPath(config) });
    await pluginManager.onReady();
  };

  const syncLoadedFrames = () => {
    frameStore.setLoadedFrames(Array.from(loadedFrameIndexes));
  };

  const markFrameLoaded = (frameIndex: number) => {
    if (loadedFrameIndexes.has(frameIndex)) {
      return;
    }

    loadedFrameIndexes.add(frameIndex);
    syncLoadedFrames();
  };

  const pruneLoadedFrames = (
    manifest: ImmersiveFrameManifest,
    frameIndex: number
  ) => {
    const unloadDistance = Math.max(
      config.unloadDistance,
      config.preloadCount + 1
    );
    let hasChanges = false;

    loadedFrameIndexes.forEach((loadedFrameIndex) => {
      if (Math.abs(loadedFrameIndex - frameIndex) <= unloadDistance) {
        return;
      }

      loadedFrameIndexes.delete(loadedFrameIndex);
      evictFrameImage(resolveFrameUrl(manifest, loadedFrameIndex));
      hasChanges = true;
    });

    if (hasChanges) {
      syncLoadedFrames();
    }
  };

  const createFrameWindow = (
    frameIndex: number,
    totalFrames: number,
    preloadCount: number
  ) => {
    const frameWindow = [frameIndex];

    for (let offset = 1; offset <= preloadCount; offset += 1) {
      const nextForwardFrame = frameIndex + offset;
      const nextBackwardFrame = frameIndex - offset;

      if (nextForwardFrame < totalFrames) {
        frameWindow.push(nextForwardFrame);
      }

      if (nextBackwardFrame >= 0) {
        frameWindow.push(nextBackwardFrame);
      }
    }

    return frameWindow;
  };

  const preloadFrameWindow = async (
    manifest: ImmersiveFrameManifest,
    frameIndex: number
  ) => {
    pruneLoadedFrames(manifest, frameIndex);

    const frameWindow = createFrameWindow(
      frameIndex,
      manifest.frameCount,
      Math.max(config.preloadCount, 0)
    );

    await Promise.allSettled(
      frameWindow.map(async (windowFrameIndex) => {
        const frameUrl = resolveFrameUrl(manifest, windowFrameIndex);

        await primeFrameImage(frameUrl);
        if (!destroyed) {
          markFrameLoaded(windowFrameIndex);
        }
      })
    );
  };

  const renderCurrentFrame = async () => {
    const manifest = frameStore.getState().manifest;
    if (!manifest || !renderer || destroyed) {
      return;
    }

    const renderRequest = ++lastRenderRequest;

    try {
      const frameIndex = frameStore.getState().currentFrame;
      const image = await loadFrameImage(resolveFrameUrl(manifest, frameIndex));
      if (destroyed || renderRequest !== lastRenderRequest) {
        return;
      }
      markFrameLoaded(frameIndex);
      renderer.render({ frameIndex, image });
    } catch (error) {
      const resolvedError = toError(error);
      frameStore.setError(resolvedError);
      config.events.onError?.(resolvedError);
      eventBus.emit('error', { error: resolvedError });
    }
  };

  return {
    config,
    getContext(): ImmersiveEngineContext {
      return context;
    },
    async init() {
      renderer?.mount();
      const viewport = viewportObserver.getSnapshot();
      renderer?.resize(viewport.width, viewport.height, viewport.pixelRatio);
      await pluginManager.setup();
      startLoop();

      if (options.manifest) {
        await setManifest(options.manifest);
        await renderCurrentFrame();
        return;
      }

      const manifestPath = resolveManifestPath(config);
      if (manifestPath) {
        await setManifest(await loadManifest(manifestPath));
        await renderCurrentFrame();
      }
    },
    async setManifest(manifest: ImmersiveFrameManifest) {
      await setManifest(manifest);
      await renderCurrentFrame();
    },
    async updateProgress(progress: number, immediate = false) {
      const normalized = progressController.setProgress(progress, immediate);

      // If immediate or smoothing is disabled, we sync right away
      if (immediate || !config.scroll.smooth) {
        await syncToProgress(normalized);
      }
    },
    updateScroll(scrollY: number, velocity = 0) {
      const previousState = scrollStore.getState();
      const nextIsScrolling = Math.abs(velocity) > 0;

      scrollStore.update({ scrollY, velocity, isScrolling: nextIsScrolling });
      const nextScrollState = scrollStore.getState();

      if (!previousState.isScrolling && nextIsScrolling) {
        config.events.onScrollStart?.();
        eventBus.emit('scrollStart', nextScrollState);
      }
    },
    endScroll(scrollY = scrollStore.getState().scrollY) {
      const previousState = scrollStore.getState();

      scrollStore.update({
        scrollY,
        velocity: 0,
        direction: 'idle',
        isScrolling: false
      });
      const nextScrollState = scrollStore.getState();

      if (previousState.isScrolling) {
        config.events.onScrollEnd?.();
        eventBus.emit('scrollEnd', nextScrollState);
      }
    },
    pause() {
      scrollStore.pause();
    },
    resume() {
      scrollStore.resume();
    },
    subscribeFrame: frameStore.subscribe,
    subscribeScroll: scrollStore.subscribe,
    getState() {
      return {
        frame: frameStore.getState(),
        scroll: scrollStore.getState()
      };
    },
    async destroy() {
      destroyed = true;
      lastRenderRequest += 1;
      stopLoop();
      await pluginManager.onDestroy();
      viewportUnsubscribe();
      scrollUnsubscribe();
      resizeController.disconnect();
      viewportObserver.disconnect();
      renderer?.destroy();
      eventBus.emit('destroy', { reason: 'manual' });
      eventBus.clear();
    }
  };
}
