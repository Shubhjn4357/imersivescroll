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

const defaultWorkbenchConfig = {
  visual: defaultWorkbenchVisualState,
  scrollbar: {
    enabled: defaultWorkbenchScrollbarState.showScrollbar,
    visibilityMode: 'manual',
    trackOpacity: defaultWorkbenchScrollbarState.trackOpacity,
    thumbOpacity: defaultWorkbenchScrollbarState.thumbOpacity,
    thumbColor: defaultWorkbenchScrollbarState.thumbColor
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
  const sceneControls = useImmersiveConfigControls({
    initialConfig: defaultWorkbenchConfig
  });
  const [manifest, setManifest] = useState<ImmersiveFrameManifest | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [loadedFrameCount, setLoadedFrameCount] = useState(0);
  const [viewportSize, setViewportSize] = useState<ViewportSize>({
    width: 0,
    height: 0
  });
  const [scrollScreens, setScrollScreens] = useState(defaultScrollScreens);

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

  const workbenchConfig = useMemo<PartialImmersiveConfig>(
    () => ({
      visual: visualControls,
      scrollbar: {
        enabled: scrollbarControls.showScrollbar,
        visibilityMode: 'manual',
        trackOpacity: scrollbarControls.trackOpacity,
        thumbOpacity: scrollbarControls.thumbOpacity,
        thumbColor: scrollbarControls.thumbColor
      }
    }),
    [scrollbarControls, visualControls]
  );

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
    setProgress(element.scrollTop / maxScroll);
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
              The preview-only scroll span stays separate from the shipped
              runtime config.
            </p>
            <pre className="code-block">
              <code>{liveConfig}</code>
            </pre>
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
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
