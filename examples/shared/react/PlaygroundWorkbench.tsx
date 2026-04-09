'use client';

import type { ChangeEvent, CSSProperties, UIEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type {
  ImmersiveFrameManifest,
  ObjectFitMode,
  PartialImmersiveConfig
} from 'immersive-scroll';
import { useImmersiveConfigControls } from 'immersive-scroll';
import {
  defaultSceneFramesPath,
  defaultSceneManifestPath,
  landingSource
} from '../landing-content';
import { CodeBlock } from './CodeBlock';

interface WorkbenchVisualState {
  overlayOpacity: number;
  brightness: number;
  contrast: number;
  saturate: number;
  blur: number;
  objectFit: ObjectFitMode;
}

interface WorkbenchScrollbarState {
  showScrollbar: boolean;
  trackOpacity: number;
  thumbOpacity: number;
  thumbColor: string;
}

interface WorkbenchScrollState {
  smooth: boolean;
  lerp: number;
  duration: number;
}

interface ViewportSize {
  width: number;
  height: number;
}

interface PreviewPanel {
  eyebrow: string;
  title: string;
  description: string;
  align: 'left' | 'right';
  details: readonly string[];
}

const defaultWorkbenchVisualState: WorkbenchVisualState = {
  overlayOpacity: 0.24,
  brightness: 0.96,
  contrast: 1.08,
  saturate: 1.12,
  blur: 0,
  objectFit: 'cover'
};

const defaultWorkbenchScrollbarState: WorkbenchScrollbarState = {
  showScrollbar: true,
  trackOpacity: 0.18,
  thumbOpacity: 0.94,
  thumbColor: '#8de1ff'
};

const defaultWorkbenchScrollState: WorkbenchScrollState = {
  smooth: true,
  lerp: 0.18,
  duration: 0.55
};

const defaultWorkbenchConfig = {
  visual: defaultWorkbenchVisualState,
  scroll: {
    enabled: true,
    smooth: defaultWorkbenchScrollState.smooth,
    lerp: defaultWorkbenchScrollState.lerp,
    duration: defaultWorkbenchScrollState.duration
  },
  scrollbar: {
    enabled: defaultWorkbenchScrollbarState.showScrollbar,
    visibilityMode: 'manual',
    trackOpacity: defaultWorkbenchScrollbarState.trackOpacity,
    thumbOpacity: defaultWorkbenchScrollbarState.thumbOpacity,
    thumbColor: defaultWorkbenchScrollbarState.thumbColor
  },
  debug: {
    enabled: false,
    showFrameIndex: true,
    showProgress: true,
    showVelocity: true,
    showManifestStatus: true
  }
} satisfies PartialImmersiveConfig;

const defaultScrollScreens = 3.2;

const thumbColorOptions = ['#8de1ff', '#ffd36e', '#7cf7c0', '#f4a8ff'] as const;

const previewPanels: readonly PreviewPanel[] = [
  {
    eyebrow: 'Pinned viewport',
    title: 'The scene stays pinned while the story moves through it.',
    description:
      'Scroll inside this preview, not the page. The content drives progress while the frame surface remains pinned in place.',
    align: 'left',
    details: ['Contained scroll', 'Pinned viewport', 'Frame scrub']
  },
  {
    eyebrow: 'Visual tuning',
    title:
      'Filters and fit mode should change art direction without changing the asset pipeline.',
    description:
      'Use the controls below to push contrast, saturation, blur, overlay depth, and object-fit while keeping the same source sequence.',
    align: 'right',
    details: ['Brightness', 'Contrast', 'Saturate']
  },
  {
    eyebrow: 'Scrollbar system',
    title: 'Scrollbar chrome is part of the composition, not an afterthought.',
    description:
      'The rail is rendered separately from the scene so route-specific shells can expose or hide it without touching the frame engine.',
    align: 'left',
    details: ['Manual visibility', 'Thumb color', 'Track opacity']
  },
  {
    eyebrow: 'Product review',
    title:
      'Use the same preview to QA progress, frame selection, and motion timing.',
    description:
      'Because the scroller is bounded, it becomes easier to tune the feel of a scene without reloading the entire route.',
    align: 'right',
    details: ['Live progress', 'Frame readout', 'Repeatable QA']
  }
] as const;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function isImmersiveFrameManifest(
  value: unknown
): value is ImmersiveFrameManifest {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Partial<ImmersiveFrameManifest>;
  return (
    typeof candidate.frameCount === 'number' &&
    candidate.frameCount > 0 &&
    typeof candidate.framePrefix === 'string' &&
    typeof candidate.format === 'string'
  );
}

function resolveFrameUrl(
  manifest: ImmersiveFrameManifest,
  frameIndex: number
): string {
  const basePath = (manifest.framesPath ?? '').replace(/\/$/, '');
  const frameNumber = String(frameIndex + 1).padStart(5, '0');
  return `${basePath}/${manifest.framePrefix}-${frameNumber}.${manifest.format}`;
}

function buildCanvasFilter(controls: WorkbenchVisualState) {
  return `brightness(${controls.brightness}) contrast(${controls.contrast}) saturate(${controls.saturate}) blur(${controls.blur}px)`;
}

function resolvePreviewSmoothingAmount(
  deltaTimeMs: number,
  lerpAmount: number,
  durationSeconds: number
) {
  const normalizedLerp = clamp(lerpAmount, 0.01, 1);
  const normalizedDuration = Math.max(durationSeconds, 0.001);
  const frameRateAdjustedAmount =
    1 - Math.pow(1 - normalizedLerp, deltaTimeMs / 16);
  const durationAdjustedAmount = clamp(
    deltaTimeMs / (normalizedDuration * 1000),
    0.01,
    1
  );

  return clamp(
    Math.max(frameRateAdjustedAmount, durationAdjustedAmount),
    0.01,
    1
  );
}

function drawFrameToCanvas(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  viewportSize: ViewportSize,
  controls: WorkbenchVisualState
) {
  const context = canvas.getContext('2d');
  if (!context || viewportSize.width <= 0 || viewportSize.height <= 0) {
    return;
  }

  const devicePixelRatio = window.devicePixelRatio || 1;
  const renderWidth = Math.max(1, Math.round(viewportSize.width));
  const renderHeight = Math.max(1, Math.round(viewportSize.height));
  const nextCanvasWidth = Math.max(
    1,
    Math.round(renderWidth * devicePixelRatio)
  );
  const nextCanvasHeight = Math.max(
    1,
    Math.round(renderHeight * devicePixelRatio)
  );

  if (canvas.width !== nextCanvasWidth || canvas.height !== nextCanvasHeight) {
    canvas.width = nextCanvasWidth;
    canvas.height = nextCanvasHeight;
  }

  context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  context.clearRect(0, 0, renderWidth, renderHeight);
  context.fillStyle = '#03060c';
  context.fillRect(0, 0, renderWidth, renderHeight);
  context.save();
  context.filter = buildCanvasFilter(controls);

  if (controls.objectFit === 'fill') {
    context.drawImage(image, 0, 0, renderWidth, renderHeight);
    context.restore();
    return;
  }

  const widthScale = renderWidth / image.naturalWidth;
  const heightScale = renderHeight / image.naturalHeight;
  const scale =
    controls.objectFit === 'contain'
      ? Math.min(widthScale, heightScale)
      : Math.max(widthScale, heightScale);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  const offsetX = (renderWidth - drawWidth) / 2;
  const offsetY = (renderHeight - drawHeight) / 2;

  context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
  context.restore();
}

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function formatNumber(value: number) {
  return value.toFixed(2).replace(/\.00$/, '');
}

function RangeField({
  label,
  value,
  minimum,
  maximum,
  step,
  onChange,
  formatter = formatNumber
}: {
  label: string;
  value: number;
  minimum: number;
  maximum: number;
  step: number;
  onChange: (nextValue: number) => void;
  formatter?: (value: number) => string;
}) {
  return (
    <label className="control-field">
      <span className="control-field__label">{label}</span>
      <span className="control-field__value">{formatter(value)}</span>
      <input
        className="control-range"
        max={maximum}
        min={minimum}
        step={step}
        type="range"
        value={value}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
      />
    </label>
  );
}

function ToggleField({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (nextValue: boolean) => void;
}) {
  return (
    <label className="control-toggle">
      <span className="control-field__label">{label}</span>
      <button
        className={`control-toggle__button${
          checked ? ' control-toggle__button--active' : ''
        }`}
        type="button"
        onClick={() => onChange(!checked)}
      >
        {checked ? 'On' : 'Off'}
      </button>
    </label>
  );
}

export function PlaygroundWorkbench() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const progressRef = useRef(0);
  const lastScrollTopRef = useRef(0);
  const lastScrollTimestampRef = useRef(0);
  const velocityTimeoutRef = useRef(0);
  const sceneControls = useImmersiveConfigControls({
    initialConfig: defaultWorkbenchConfig
  });
  const [manifest, setManifest] = useState<ImmersiveFrameManifest | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [targetProgress, setTargetProgress] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [loadedFrameCount, setLoadedFrameCount] = useState(0);
  const [viewportSize, setViewportSize] = useState<ViewportSize>({
    width: 0,
    height: 0
  });
  const [scrollScreens, setScrollScreens] = useState(defaultScrollScreens);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(
    () => () => {
      window.clearTimeout(velocityTimeoutRef.current);
    },
    []
  );

  useEffect(() => {
    let active = true;

    void fetch(defaultSceneManifestPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Manifest request failed with ${response.status}`);
        }

        return response.json() as Promise<unknown>;
      })
      .then((data) => {
        if (!active) {
          return;
        }

        if (!isImmersiveFrameManifest(data)) {
          throw new Error('Manifest shape is invalid.');
        }

        setManifest(data);
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }

        const message =
          error instanceof Error ? error.message : 'Unable to load manifest.';
        setLoadError(message);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const viewportElement = viewportRef.current;
    if (!viewportElement) {
      return;
    }

    const updateViewportSize = () => {
      setViewportSize({
        width: viewportElement.clientWidth,
        height: viewportElement.clientHeight
      });
    };

    updateViewportSize();

    const observer = new ResizeObserver(() => {
      updateViewportSize();
    });

    observer.observe(viewportElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!manifest) {
      return;
    }

    let disposed = false;
    const nextCache = new Map<number, HTMLImageElement>();

    setLoadedFrameCount(0);

    for (
      let frameIndex = 0;
      frameIndex < manifest.frameCount;
      frameIndex += 1
    ) {
      const image = new Image();
      image.decoding = 'async';
      image.src = resolveFrameUrl(manifest, frameIndex);
      image.onload = () => {
        if (disposed) {
          return;
        }

        nextCache.set(frameIndex, image);
        imageCacheRef.current = nextCache;
        setLoadedFrameCount(nextCache.size);
      };
    }

    return () => {
      disposed = true;
      imageCacheRef.current = new Map<number, HTMLImageElement>();
    };
  }, [manifest]);

  const visualControls = useMemo<WorkbenchVisualState>(
    () => ({
      overlayOpacity:
        sceneControls.config.visual?.overlayOpacity ??
        defaultWorkbenchVisualState.overlayOpacity,
      brightness:
        sceneControls.config.visual?.brightness ??
        defaultWorkbenchVisualState.brightness,
      contrast:
        sceneControls.config.visual?.contrast ??
        defaultWorkbenchVisualState.contrast,
      saturate:
        sceneControls.config.visual?.saturate ??
        defaultWorkbenchVisualState.saturate,
      blur:
        sceneControls.config.visual?.blur ?? defaultWorkbenchVisualState.blur,
      objectFit:
        sceneControls.config.visual?.objectFit ??
        defaultWorkbenchVisualState.objectFit
    }),
    [sceneControls.config.visual]
  );

  const scrollbarControls = useMemo<WorkbenchScrollbarState>(
    () => ({
      showScrollbar:
        sceneControls.config.scrollbar?.enabled ??
        defaultWorkbenchScrollbarState.showScrollbar,
      trackOpacity:
        sceneControls.config.scrollbar?.trackOpacity ??
        defaultWorkbenchScrollbarState.trackOpacity,
      thumbOpacity:
        sceneControls.config.scrollbar?.thumbOpacity ??
        defaultWorkbenchScrollbarState.thumbOpacity,
      thumbColor:
        sceneControls.config.scrollbar?.thumbColor ??
        defaultWorkbenchScrollbarState.thumbColor
    }),
    [sceneControls.config.scrollbar]
  );

  const scrollControls = useMemo<WorkbenchScrollState>(
    () => ({
      smooth:
        sceneControls.config.scroll?.smooth ??
        defaultWorkbenchScrollState.smooth,
      lerp:
        sceneControls.config.scroll?.lerp ?? defaultWorkbenchScrollState.lerp,
      duration:
        sceneControls.config.scroll?.duration ??
        defaultWorkbenchScrollState.duration
    }),
    [sceneControls.config.scroll]
  );
  const debugEnabled = sceneControls.config.debug?.enabled ?? false;

  const workbenchConfig = useMemo<PartialImmersiveConfig>(
    () => ({
      visual: visualControls,
      scroll: {
        enabled: true,
        smooth: scrollControls.smooth,
        lerp: scrollControls.lerp,
        duration: scrollControls.duration
      },
      scrollbar: {
        enabled: scrollbarControls.showScrollbar,
        visibilityMode: 'manual',
        trackOpacity: scrollbarControls.trackOpacity,
        thumbOpacity: scrollbarControls.thumbOpacity,
        thumbColor: scrollbarControls.thumbColor
      },
      debug: {
        enabled: debugEnabled,
        showFrameIndex: true,
        showProgress: true,
        showVelocity: true,
        showManifestStatus: true
      }
    }),
    [debugEnabled, scrollControls, scrollbarControls, visualControls]
  );

  useEffect(() => {
    if (!scrollControls.smooth) {
      progressRef.current = targetProgress;
      setProgress(targetProgress);
      return;
    }

    let animationFrameId = 0;
    let lastTimestamp = performance.now();

    const animateProgress = (timestamp: number) => {
      const deltaTime = Math.max(timestamp - lastTimestamp, 16);
      const currentProgress = progressRef.current;
      const progressGap = targetProgress - currentProgress;

      lastTimestamp = timestamp;

      if (Math.abs(progressGap) <= 0.0005) {
        if (currentProgress !== targetProgress) {
          progressRef.current = targetProgress;
          setProgress(targetProgress);
        }
        return;
      }

      const nextProgress = clamp(
        currentProgress +
          progressGap *
            resolvePreviewSmoothingAmount(
              deltaTime,
              scrollControls.lerp,
              scrollControls.duration
            ),
        0,
        1
      );
      const resolvedProgress =
        Math.abs(targetProgress - nextProgress) <= 0.0005
          ? targetProgress
          : nextProgress;

      progressRef.current = resolvedProgress;
      setProgress(resolvedProgress);
      animationFrameId = window.requestAnimationFrame(animateProgress);
    };

    animationFrameId = window.requestAnimationFrame(animateProgress);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [
    scrollControls.duration,
    scrollControls.lerp,
    scrollControls.smooth,
    targetProgress
  ]);

  const currentFrame = useMemo(() => {
    if (!manifest) {
      return 0;
    }

    return Math.round(
      clamp(progress, 0, 1) * Math.max(manifest.frameCount - 1, 0)
    );
  }, [manifest, progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageCacheRef.current.get(currentFrame);

    if (!canvas || !image) {
      return;
    }

    drawFrameToCanvas(canvas, image, viewportSize, visualControls);
  }, [currentFrame, loadedFrameCount, viewportSize, visualControls]);

  const stageHeight = useMemo(() => {
    const nextViewportHeight = Math.max(viewportSize.height, 560);
    return nextViewportHeight * scrollScreens;
  }, [scrollScreens, viewportSize.height]);

  const sectionMinHeight = useMemo(() => {
    if (previewPanels.length === 0) {
      return Math.max(viewportSize.height, 560);
    }

    return stageHeight / previewPanels.length;
  }, [stageHeight, viewportSize.height]);

  const thumbHeight = useMemo(() => {
    const heightBase = Math.max(viewportSize.height * 0.18, 88);
    return Math.min(heightBase, Math.max(viewportSize.height * 0.32, 120));
  }, [viewportSize.height]);

  const thumbStyle: CSSProperties = useMemo(
    () => ({
      height: thumbHeight,
      opacity: scrollbarControls.thumbOpacity,
      background: scrollbarControls.thumbColor,
      transform: `translate3d(0, calc((100% - ${thumbHeight}px) * ${progress.toFixed(4)}), 0)`,
      boxShadow: `0 0 24px ${scrollbarControls.thumbColor}55`
    }),
    [
      progress,
      scrollbarControls.thumbColor,
      scrollbarControls.thumbOpacity,
      thumbHeight
    ]
  );

  const liveConfig = useMemo(
    () =>
      JSON.stringify(
        {
          framesPath: defaultSceneFramesPath,
          config: workbenchConfig,
          preview: {
            scrollScreens: Number(scrollScreens.toFixed(1))
          }
        },
        null,
        2
      ),
    [scrollScreens, workbenchConfig]
  );

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const maxScroll = Math.max(element.scrollHeight - element.clientHeight, 1);
    const nextTargetProgress = element.scrollTop / maxScroll;
    const nextTimestamp = performance.now();
    const deltaScroll = element.scrollTop - lastScrollTopRef.current;
    const deltaTime = Math.max(
      nextTimestamp - lastScrollTimestampRef.current,
      16
    );

    lastScrollTopRef.current = element.scrollTop;
    lastScrollTimestampRef.current = nextTimestamp;

    setTargetProgress(nextTargetProgress);
    setScrollVelocity(deltaScroll / deltaTime);
    window.clearTimeout(velocityTimeoutRef.current);
    velocityTimeoutRef.current = window.setTimeout(() => {
      setScrollVelocity(0);
    }, 120);

    if (!scrollControls.smooth) {
      progressRef.current = nextTargetProgress;
      setProgress(nextTargetProgress);
    }
  };

  return (
    <section className="playground-workbench" data-trigger="section">
      <div className="playground-preview-shell glass-card" data-reveal="card">
        <div className="playground-preview-shell__header">
          <div>
            <p className="eyebrow">Contained preview</p>
            <h3>
              Scroll inside this panel to test the scene without moving the
              whole route.
            </h3>
            <p>
              The workbench is driven by
              <code> useImmersiveConfigControls() </code>
              and the shared <code>/immersive/scene</code> asset set, so the
              preview and the package docs stay aligned.
            </p>
            <div className="docs-inline-list">
              <span className="docs-chip">Hook-driven controls</span>
              <span className="docs-chip">Shared /immersive/scene</span>
              <span className="docs-chip">Default fixed viewport</span>
              <span className="docs-chip">
                {scrollControls.smooth ? 'Smooth scrub on' : 'Smooth scrub off'}
              </span>
            </div>
          </div>
          <div className="info-pill-row">
            <span className="info-pill">
              Progress {formatPercent(progress)}
            </span>
            <span className="info-pill">
              Frame {manifest ? currentFrame + 1 : 0}/
              {manifest?.frameCount ?? 0}
            </span>
            <span className="info-pill">
              Loaded {loadedFrameCount}/{manifest?.frameCount ?? 0}
            </span>
          </div>
        </div>

        <div
          className="playground-preview-scroll"
          ref={scrollRef}
          onScroll={handleScroll}
        >
          <div
            className="playground-preview-stage"
            style={{ minHeight: stageHeight }}
          >
            <div className="playground-preview-viewport" ref={viewportRef}>
              <canvas className="playground-preview-canvas" ref={canvasRef} />
              <div
                className="playground-preview-vignette"
                style={{ opacity: visualControls.overlayOpacity }}
              />
              {scrollbarControls.showScrollbar ? (
                <div
                  className="playground-preview-scrollbar"
                  aria-hidden="true"
                >
                  <div
                    className="playground-preview-scrollbar__track"
                    style={{ opacity: scrollbarControls.trackOpacity }}
                  />
                  <div
                    className="playground-preview-scrollbar__thumb"
                    style={thumbStyle}
                  />
                </div>
              ) : null}

              <div className="playground-preview-hud">
                {debugEnabled ? (
                  <div className="playground-preview-debug">
                    <strong>Debug HUD</strong>
                    <span>progress {progress.toFixed(3)}</span>
                    <span>velocity {scrollVelocity.toFixed(3)}</span>
                    <span>
                      frame {manifest ? currentFrame + 1 : 0}/
                      {manifest?.frameCount ?? 0}
                    </span>
                    <span>
                      loaded {loadedFrameCount}/{manifest?.frameCount ?? 0}
                    </span>
                  </div>
                ) : null}
                <div className="landing-status landing-status--playground">
                  <strong>Workbench</strong>
                  <span>Frame scrub inside a bounded preview</span>
                  <span>
                    {manifest
                      ? `${manifest.width}x${manifest.height} ${manifest.format.toUpperCase()}`
                      : 'Loading manifest'}
                  </span>
                </div>
                <div className="landing-source landing-source--playground">
                  <strong>{landingSource.title}</strong>
                  <span>{landingSource.label}</span>
                  <span>{landingSource.license}</span>
                </div>
              </div>
            </div>

            <div className="playground-preview-content">
              {previewPanels.map((panel, index) => (
                <section
                  className={`story-panel story-panel--compact story-panel--${panel.align}`}
                  data-trigger="section"
                  key={panel.title}
                  style={{ minHeight: sectionMinHeight }}
                >
                  <article
                    className="story-card story-card--compact"
                    data-align={panel.align}
                    data-reveal="card"
                  >
                    <p className="eyebrow">{panel.eyebrow}</p>
                    <h2>{panel.title}</h2>
                    <p>{panel.description}</p>
                    <div className="info-pill-row">
                      {panel.details.map((detail) => (
                        <span
                          className="info-pill"
                          key={`${panel.title}-${detail}`}
                        >
                          {detail}
                        </span>
                      ))}
                    </div>
                    {index === 0 && loadError ? (
                      <p className="reference-row__default">
                        Manifest error: {loadError}
                      </p>
                    ) : null}
                  </article>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="playground-control-dock glass-card" data-reveal="card">
        <div className="playground-control-dock__header">
          <div>
            <p className="eyebrow">Live controls</p>
            <h3>
              Tweak the scene props and watch the preview react immediately.
            </h3>
            <p>
              These fields patch the same typed config surface you would use in
              a product route or a custom debug toolbar.
            </p>
          </div>
          <button
            className="action-pill"
            type="button"
            onClick={() => {
              sceneControls.resetConfig();
              setScrollScreens(defaultScrollScreens);
              progressRef.current = 0;
              lastScrollTopRef.current = 0;
              lastScrollTimestampRef.current = performance.now();
              setProgress(0);
              setTargetProgress(0);
              setScrollVelocity(0);
              scrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
            }}
          >
            Reset controls
          </button>
        </div>

        <div className="playground-control-grid">
          <div className="playground-control-card">
            <p className="eyebrow">Visual</p>
            <RangeField
              label="Overlay opacity"
              value={visualControls.overlayOpacity}
              minimum={0}
              maximum={0.55}
              step={0.01}
              onChange={(nextValue) =>
                sceneControls.updateVisual({ overlayOpacity: nextValue })
              }
              formatter={formatPercent}
            />
            <RangeField
              label="Brightness"
              value={visualControls.brightness}
              minimum={0.7}
              maximum={1.25}
              step={0.01}
              onChange={(nextValue) =>
                sceneControls.updateVisual({ brightness: nextValue })
              }
            />
            <RangeField
              label="Contrast"
              value={visualControls.contrast}
              minimum={0.8}
              maximum={1.4}
              step={0.01}
              onChange={(nextValue) =>
                sceneControls.updateVisual({ contrast: nextValue })
              }
            />
            <RangeField
              label="Saturate"
              value={visualControls.saturate}
              minimum={0.8}
              maximum={1.5}
              step={0.01}
              onChange={(nextValue) =>
                sceneControls.updateVisual({ saturate: nextValue })
              }
            />
            <RangeField
              label="Blur"
              value={visualControls.blur}
              minimum={0}
              maximum={8}
              step={0.1}
              onChange={(nextValue) =>
                sceneControls.updateVisual({ blur: nextValue })
              }
            />

            <label className="control-field">
              <span className="control-field__label">Object fit</span>
              <select
                className="control-select"
                value={visualControls.objectFit}
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                  sceneControls.updateVisual({
                    objectFit: event.currentTarget.value as ObjectFitMode
                  })
                }
              >
                <option value="cover">cover</option>
                <option value="contain">contain</option>
                <option value="fill">fill</option>
              </select>
            </label>
          </div>

          <div className="playground-control-card">
            <p className="eyebrow">Scrollbar</p>
            <ToggleField
              label="Show custom scrollbar"
              checked={scrollbarControls.showScrollbar}
              onChange={(nextValue) =>
                sceneControls.updateScrollbar({ enabled: nextValue })
              }
            />
            <RangeField
              label="Track opacity"
              value={scrollbarControls.trackOpacity}
              minimum={0}
              maximum={0.4}
              step={0.01}
              onChange={(nextValue) =>
                sceneControls.updateScrollbar({ trackOpacity: nextValue })
              }
              formatter={formatPercent}
            />
            <RangeField
              label="Thumb opacity"
              value={scrollbarControls.thumbOpacity}
              minimum={0.2}
              maximum={1}
              step={0.01}
              onChange={(nextValue) =>
                sceneControls.updateScrollbar({ thumbOpacity: nextValue })
              }
              formatter={formatPercent}
            />

            <div className="control-swatch-group">
              <span className="control-field__label">Thumb color</span>
              <div className="control-swatch-row">
                {thumbColorOptions.map((color) => (
                  <button
                    key={color}
                    aria-label={`Use ${color} thumb color`}
                    className={`control-swatch${
                      scrollbarControls.thumbColor === color
                        ? ' control-swatch--active'
                        : ''
                    }`}
                    style={{ background: color }}
                    type="button"
                    onClick={() =>
                      sceneControls.updateScrollbar({ thumbColor: color })
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="playground-control-card">
            <p className="eyebrow">Scroll + debug</p>
            <ToggleField
              label="Smooth scrub"
              checked={scrollControls.smooth}
              onChange={(nextValue) =>
                sceneControls.updateScroll({ smooth: nextValue })
              }
            />
            <RangeField
              label="Lerp"
              value={scrollControls.lerp}
              minimum={0.04}
              maximum={0.45}
              step={0.01}
              onChange={(nextValue) =>
                sceneControls.updateScroll({ lerp: nextValue })
              }
            />
            <RangeField
              label="Duration"
              value={scrollControls.duration}
              minimum={0.15}
              maximum={1.4}
              step={0.05}
              onChange={(nextValue) =>
                sceneControls.updateScroll({ duration: nextValue })
              }
            />
            <ToggleField
              label="Show debug HUD"
              checked={debugEnabled}
              onChange={(nextValue) =>
                sceneControls.updateDebug({ enabled: nextValue })
              }
            />
            <RangeField
              label="Scroll span"
              value={scrollScreens}
              minimum={2.4}
              maximum={4.8}
              step={0.1}
              onChange={setScrollScreens}
            />
          </div>

          <article className="playground-control-card playground-control-card--code">
            <p className="eyebrow">Current props</p>
            <h3>Live configuration snapshot</h3>
            <p>
              Copy this shape into the package component after tuning the scene.
              The preview-only scroll span stays separate, while smooth scrub,
              debug HUD, and scrollbar controls map directly to the shipped
              runtime config.
            </p>
            <CodeBlock code={liveConfig} language="json" />
            <div className="docs-inline-list">
              <span className="docs-chip docs-chip--muted">
                pnpm extract &quot;./video.mp4&quot;
              </span>
              <span className="docs-chip docs-chip--muted">
                useImmersiveConfigControls()
              </span>
              <span className="docs-chip docs-chip--muted">
                Shared WebP frames
              </span>
              <span className="docs-chip docs-chip--muted">
                scroll.smooth / lerp / duration
              </span>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
