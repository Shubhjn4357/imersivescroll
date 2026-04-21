import {
  createWindowScrollSync,
  createImmersiveEngine,
  DEFAULT_IMMERSIVE_CONFIG,
  normalizeImmersiveConfig
} from '@immersive-scroll/core';
import type {
  FrameStoreState,
  ImmersivePlugin,
  PartialImmersiveConfig,
  ScrollState
} from '@immersive-scroll/core';
import type { PropsWithChildren, RefObject } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { resolveProgressFromScrollY } from '../utils/scrollMetrics';
import { ImmersiveContext } from './ImmersiveContext';

interface ImmersiveScrollProviderProps extends PropsWithChildren {
  config?: PartialImmersiveConfig | undefined;
  framesPath?: string | null;
  manifestPath?: string | null;
  video?: string | null;
  plugins?: ImmersivePlugin[] | undefined;
  containerRef: RefObject<HTMLDivElement | null>;
  viewportRef: RefObject<HTMLDivElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  scrollSource?: 'window' | 'container' | 'manual';
}

const emptyFrameState: FrameStoreState = {
  currentFrame: 0,
  totalFrames: 0,
  frameUrl: null,
  manifest: null,
  ready: false,
  error: null,
  loadedFrames: []
};

const emptyScrollState: ScrollState = {
  progress: 0,
  scrollY: 0,
  velocity: 0,
  direction: 'idle',
  isScrolling: false,
  enabled: true,
  paused: false,
  orientation: 'vertical'
};

function areLoadedFramesEqual(
  currentLoadedFrames: number[],
  nextLoadedFrames: number[]
) {
  if (currentLoadedFrames.length !== nextLoadedFrames.length) {
    return false;
  }

  return currentLoadedFrames.every(
    (frameUrl, frameIndex) => frameUrl === nextLoadedFrames[frameIndex]
  );
}

function areFrameStatesEqual(
  currentFrame: FrameStoreState,
  nextFrame: FrameStoreState
) {
  return (
    currentFrame.currentFrame === nextFrame.currentFrame &&
    currentFrame.totalFrames === nextFrame.totalFrames &&
    currentFrame.frameUrl === nextFrame.frameUrl &&
    currentFrame.manifest === nextFrame.manifest &&
    currentFrame.ready === nextFrame.ready &&
    currentFrame.error === nextFrame.error &&
    areLoadedFramesEqual(currentFrame.loadedFrames, nextFrame.loadedFrames)
  );
}

function areScrollStatesEqual(
  currentScroll: ScrollState,
  nextScroll: ScrollState
) {
  return (
    currentScroll.progress === nextScroll.progress &&
    currentScroll.scrollY === nextScroll.scrollY &&
    currentScroll.velocity === nextScroll.velocity &&
    currentScroll.direction === nextScroll.direction &&
    currentScroll.isScrolling === nextScroll.isScrolling &&
    currentScroll.enabled === nextScroll.enabled &&
    currentScroll.paused === nextScroll.paused &&
    currentScroll.orientation === nextScroll.orientation
  );
}

export function ImmersiveScrollProvider({
  children,
  config,
  framesPath = null,
  manifestPath = null,
  video = null,
  plugins,
  containerRef,
  viewportRef,
  canvasRef,
  scrollSource = 'window'
}: ImmersiveScrollProviderProps) {
  const [frame, setFrame] = useState<FrameStoreState>(emptyFrameState);
  const [scroll, setScroll] = useState<ScrollState>(emptyScrollState);
  const [engine, setEngine] = useState<ReturnType<
    typeof createImmersiveEngine
  > | null>(null);
  const initializedRef = useRef(false);
  const resolvedPlugins = useMemo(() => plugins ?? [], [plugins]);

  const normalizedConfig = useMemo(
    () =>
      normalizeImmersiveConfig({
        ...config,
        framesPath,
        manifestPath:
          manifestPath ??
          (framesPath
            ? `${framesPath.replace(/\/$/, '')}/manifest.json`
            : null),
        video
      }),
    [config, framesPath, manifestPath, video]
  );
  const normalizedConfigRef = useRef(normalizedConfig);

  useEffect(() => {
    normalizedConfigRef.current = normalizedConfig;
  }, [normalizedConfig]);

  useEffect(() => {
    if (
      initializedRef.current ||
      !containerRef.current ||
      !viewportRef.current ||
      !canvasRef.current
    ) {
      return;
    }

    initializedRef.current = true;

    const nextEngine = createImmersiveEngine({
      config: normalizedConfig,
      container: viewportRef.current,
      targets: { canvas: canvasRef.current },
      plugins: resolvedPlugins
    });

    const unsubscribeFrame = nextEngine.subscribeFrame((nextFrame) =>
      setFrame((currentFrame) =>
        areFrameStatesEqual(currentFrame, nextFrame) ? currentFrame : nextFrame
      )
    );
    const unsubscribeScroll = nextEngine.subscribeScroll((nextScroll) =>
      setScroll((currentScroll) =>
        areScrollStatesEqual(currentScroll, nextScroll)
          ? currentScroll
          : nextScroll
      )
    );

    setEngine(nextEngine);
    void nextEngine.init();

    if (scrollSource === 'manual') {
      return () => {
        unsubscribeFrame();
        unsubscribeScroll();
        void nextEngine.destroy();
        initializedRef.current = false;
      };
    }

    const scrollSync = createWindowScrollSync({
      scrollTarget:
        scrollSource === 'container'
          ? (containerRef.current as EventTarget)
          : window,
      getScrollY: () =>
        scrollSource === 'container'
          ? (containerRef.current?.scrollTop ?? 0)
          : window.scrollY,
      callbacks: {
        updateProgress(progress) {
          return nextEngine.updateProgress(progress);
        },
        updateScroll(scrollY, velocity) {
          nextEngine.updateScroll(scrollY, velocity);
        },
        endScroll(scrollY) {
          nextEngine.endScroll(scrollY);
        }
      },
      resolveProgress(scrollY) {
        if (scrollSource === 'container' && containerRef.current) {
          const element = containerRef.current;
          const maxScroll = Math.max(
            element.scrollHeight - element.clientHeight,
            1
          );
          return scrollY / maxScroll;
        }

        return resolveProgressFromScrollY(scrollY, containerRef.current);
      },
      getScrollConfig() {
        return normalizedConfigRef.current.scroll;
      }
    });

    if (scrollSource === 'container' && containerRef.current) {
      containerRef.current.addEventListener('scroll', scrollSync.syncNow, {
        passive: true
      });
    }

    scrollSync.syncNow();

    return () => {
      scrollSync.destroy();
      if (scrollSource === 'container' && containerRef.current) {
        containerRef.current.removeEventListener('scroll', scrollSync.syncNow);
      }
      unsubscribeFrame();
      unsubscribeScroll();
      void nextEngine.destroy();
      initializedRef.current = false;
    };
  }, [canvasRef, containerRef, normalizedConfig, resolvedPlugins, viewportRef]);

  return (
    <ImmersiveContext.Provider
      value={{
        config: normalizedConfig ?? DEFAULT_IMMERSIVE_CONFIG,
        frame,
        scroll,
        engine,
        plugins: resolvedPlugins,
        containerRef,
        canvasRef
      }}
    >
      {children}
    </ImmersiveContext.Provider>
  );
}
