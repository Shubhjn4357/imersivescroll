'use client';

import type { ChangeEvent } from 'react';
import { useMemo, useState } from 'react';
import {
  ImmersiveScroll,
  useImmersiveProgress,
  useImmersiveFrame,
  useImmersiveVelocity
} from 'immersive-scroll';
import type { ObjectFitMode, PartialImmersiveConfig } from 'immersive-scroll';
import { useImmersiveConfigControls } from 'immersive-scroll';
import {
  defaultSceneFramesPath,
  defaultSceneManifestPath
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
        aria-label={checked ? 'Turn off' : 'Turn on'}
      >
        {checked ? 'On' : 'Off'}
      </button>
    </label>
  );
}

export function PlaygroundWorkbench() {
  const sceneControls = useImmersiveConfigControls({
    initialConfig: defaultWorkbenchConfig
  });
  const [scrollScreens, setScrollScreens] = useState(defaultScrollScreens);

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

  return (
    <section className="playground-workbench" data-trigger="section">
      <div className="playground-preview-shell glass-card" data-reveal="card">
        <ImmersiveScroll
          scrollSource="container"
          manifestPath={defaultSceneManifestPath}
          framesPath={defaultSceneFramesPath}
          config={workbenchConfig}
          style={{ height: '560px' }}
          overlay={
            <>
              <div className="playground-preview-shell__header-overlay">
                <WorkbenchHeader />
              </div>
              <div className="playground-preview-stage">
                <div style={{ height: `${scrollScreens * 100}%` }} />
              </div>
              <WorkbenchHUD debugEnabled={debugEnabled} />
            </>
          }
        >
          <div className="playground-content-sections">
            {previewPanels.map((panel, index) => (
              <div
                key={index}
                className="playground-preview-section"
                style={{ height: '560px' }}
              >
                <div
                  className={`playground-preview-section__content ${
                    panel.align === 'right'
                      ? 'playground-preview-section__content--right'
                      : ''
                  }`}
                >
                  <p className="eyebrow">{panel.eyebrow}</p>
                  <h3 className="section-title">{panel.title}</h3>
                  <p className="body-text">{panel.description}</p>
                  <div className="docs-inline-list">
                    {panel.details.map((detail) => (
                      <span
                        key={detail}
                        className="docs-chip docs-chip--outline"
                      >
                        {detail}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ImmersiveScroll>
      </div>

      <div className="playground-controls glass-card" data-reveal="card">
        <div className="playground-controls__group">
          <p className="eyebrow">Visual fidelity</p>
          <RangeField
            label="Brightness"
            maximum={2}
            minimum={0}
            step={0.01}
            value={visualControls.brightness}
            onChange={(val) => sceneControls.updateVisual({ brightness: val })}
          />
          <RangeField
            label="Contrast"
            maximum={2}
            minimum={0}
            step={0.01}
            value={visualControls.contrast}
            onChange={(val) => sceneControls.updateVisual({ contrast: val })}
          />
          <RangeField
            label="Saturate"
            maximum={2}
            minimum={0}
            step={0.01}
            value={visualControls.saturate}
            onChange={(val) => sceneControls.updateVisual({ saturate: val })}
          />
          <RangeField
            label="Blur"
            maximum={24}
            minimum={0}
            step={1}
            value={visualControls.blur}
            onChange={(val) => sceneControls.updateVisual({ blur: val })}
          />
          <div className="control-field">
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
          </div>
        </div>

        <div className="playground-controls__group">
          <p className="eyebrow">Motion feel</p>
          <ToggleField
            label="Smooth interpolation"
            checked={scrollControls.smooth}
            onChange={(val) => sceneControls.updateScroll({ smooth: val })}
          />
          <RangeField
            label="Lerp factor"
            maximum={1}
            minimum={0.01}
            step={0.01}
            value={scrollControls.lerp}
            onChange={(val) => sceneControls.updateScroll({ lerp: val })}
          />
          <RangeField
            label="Duration (s)"
            maximum={2}
            minimum={0.1}
            step={0.05}
            value={scrollControls.duration}
            onChange={(val) => sceneControls.updateScroll({ duration: val })}
          />
          <RangeField
            label="Scroll reach"
            maximum={10}
            minimum={1}
            step={0.1}
            value={scrollScreens}
            onChange={setScrollScreens}
            formatter={(v) => `${v.toFixed(1)} screens`}
          />
        </div>

        <div className="playground-controls__group">
          <p className="eyebrow">Interface</p>
          <ToggleField
            label="Scrollbar"
            checked={scrollbarControls.showScrollbar}
            onChange={(val) => sceneControls.updateScrollbar({ enabled: val })}
          />
          <RangeField
            label="Track opacity"
            maximum={1}
            minimum={0}
            step={0.01}
            value={scrollbarControls.trackOpacity}
            onChange={(val) =>
              sceneControls.updateScrollbar({ trackOpacity: val })
            }
          />
          <RangeField
            label="Thumb opacity"
            maximum={1}
            minimum={0}
            step={0.01}
            value={scrollbarControls.thumbOpacity}
            onChange={(val) =>
              sceneControls.updateScrollbar({ thumbOpacity: val })
            }
          />
          <div className="control-swatch-group">
            <span className="control-field__label">Thumb color</span>
            <div className="control-swatch-row">
              {thumbColorOptions.map((color) => (
                <button
                  key={color}
                  className={`control-swatch${scrollbarControls.thumbColor === color ? ' control-swatch--active' : ''}`}
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

        <div className="playground-controls__group">
          <p className="eyebrow">Diagnostics</p>
          <ToggleField
            label="Debug instrument"
            checked={debugEnabled}
            onChange={(val) => sceneControls.updateDebug({ enabled: val })}
          />
          <button
            className="docs-chip docs-chip--accent"
            style={{
              width: '100%',
              justifyContent: 'center',
              marginTop: '1rem'
            }}
            type="button"
            onClick={() => {
              void navigator.clipboard.writeText(liveConfig);
            }}
          >
            Copy schema JSON
          </button>
        </div>
      </div>

      <div className="playground-schema glass-card" data-reveal="card">
        <header className="playground-schema__header">
          <p className="eyebrow">Generation</p>
          <h3 className="section-title">Output configuration</h3>
        </header>
        <CodeBlock code={liveConfig} language="json" />
      </div>
    </section>
  );
}

function WorkbenchHeader() {
  const { progress } = useImmersiveProgress();
  const { currentFrame, manifest } = useImmersiveFrame();

  return (
    <div
      className="playground-preview-shell__header"
      style={{ padding: '1.25rem 2.5rem', alignItems: 'center' }}
    >
      <div className="header-content" style={{ flex: 1 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '1rem',
            marginBottom: '0.5rem'
          }}
        >
          <p className="eyebrow" style={{ marginBottom: 0 }}>
            Contained preview
          </p>
          <h3
            className="section-title"
            style={{ fontSize: '1.1rem', margin: 0 }}
          >
            Scrubbing sequence workbench
          </h3>
        </div>
      </div>
      <div className="info-pill-row" style={{ gap: '0.75rem' }}>
        <span className="info-pill" style={{ opacity: 0.9 }}>
          {formatPercent(progress)}
        </span>
        <span className="info-pill" style={{ opacity: 0.9 }}>
          F: {currentFrame + 1}/{manifest?.frameCount ?? 0}
        </span>
      </div>
    </div>
  );
}

function WorkbenchHUD({ debugEnabled }: { debugEnabled: boolean }) {
  const { progress } = useImmersiveProgress();
  const velocity = useImmersiveVelocity();
  const { manifest } = useImmersiveFrame();

  return (
    <div className="playground-hud">
      <div className="playground-instrument">
        <header className="playground-instrument__header">
          <strong className="playground-instrument__title">Telemetry</strong>
          {debugEnabled && <span className="status-dot status-dot--active" />}
        </header>
        <main className="playground-instrument__metrics">
          <div className="playground-instrument__metric">
            <span>Progress</span>
            <strong>{formatPercent(progress)}</strong>
          </div>
          <div className="playground-instrument__metric">
            <span>Velocity</span>
            <strong
              style={{ color: velocity !== 0 ? 'var(--accent)' : 'inherit' }}
            >
              {velocity.toFixed(3)}
            </strong>
          </div>
        </main>
      </div>

      <div className="playground-instrument" style={{ minWidth: '180px' }}>
        <header className="playground-instrument__header">
          <strong className="playground-instrument__title">
            Asset Metadata
          </strong>
        </header>
        <main className="playground-instrument__metrics">
          <div className="playground-instrument__metric">
            <span>Resolution</span>
            <strong>
              {manifest ? `${manifest.width}x${manifest.height}` : '...'}
            </strong>
          </div>
          <div className="playground-instrument__metric">
            <span>Format</span>
            <strong>{manifest?.format.toUpperCase() ?? '...'}</strong>
          </div>
        </main>
      </div>
    </div>
  );
}
