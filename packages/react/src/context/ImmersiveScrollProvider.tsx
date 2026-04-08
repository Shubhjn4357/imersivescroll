import {
  clamp,
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
  canvasRef
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

    let animationFrameId = 0;
    let scrollIdleTimeout = 0;
    let lastScrollY = window.scrollY;
    let lastTimestamp = performance.now();

    const syncScrollState = () => {
      animationFrameId = 0;

      const currentScrollY = window.scrollY;
      const currentTimestamp = performance.now();
      const containerElement = containerRef.current;
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

      void nextEngine.updateProgress(progress);
      nextEngine.updateScroll(currentScrollY, velocity);

      window.clearTimeout(scrollIdleTimeout);
      scrollIdleTimeout = window.setTimeout(() => {
        nextEngine.endScroll(window.scrollY);
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

    return () => {
      window.removeEventListener('scroll', queueScrollSync);
      window.removeEventListener('resize', queueScrollSync);
      window.cancelAnimationFrame(animationFrameId);
      window.clearTimeout(scrollIdleTimeout);
      unsubscribeFrame();
      unsubscribeScroll();
      void nextEngine.destroy();
      initializedRef.current = false;
    };
  }, [
    canvasRef,
    containerRef,
    normalizedConfig,
    resolvedPlugins,
    viewportRef
  ]);

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
