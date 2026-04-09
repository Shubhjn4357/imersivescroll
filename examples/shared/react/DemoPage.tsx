'use client';

import type { CSSProperties } from 'react';
import { Bug, PanelRightDashed, Pin } from 'lucide-react';
import {
  ImmersiveLayer,
  ImmersiveScroll,
  type ImmersiveScrollbarProps,
  useImmersiveConfigControls,
  useImmersiveFrame,
  useImmersiveProgress
} from 'immersive-scroll';
import {
  defaultSceneFramesPath,
  landingImmersiveConfig,
  landingSource,
  nextDemoNavigationLinks
} from '../landing-content';
import { docsQuickstartSnippets } from '../reference-content';
import { DocsFrame, type DocsSidebarGroup } from './DocsFrame';
import { SceneToolbarButton } from './SceneToolbarButton';

type ScrollbarPositionMode = 'absolute' | 'fixed';

const demoSidebarGroups: readonly DocsSidebarGroup[] = [
  {
    title: 'Demo',
    links: [
      { title: 'Preview', href: '#preview' },
      { title: 'Install', href: '#install' },
      { title: 'Usage', href: '#usage' }
    ]
  },
  {
    title: 'Reference',
    links: [
      { title: 'Toolbar', href: '#toolbar' },
      { title: 'Scrollbar', href: '#scrollbar' },
      { title: 'Code', href: '#code' }
    ]
  }
] as const;

function createDemoScrollbarProps(
  mode: ScrollbarPositionMode,
  isVisible: boolean
) {
  const fixedStyle: CSSProperties = {
    top: '104px',
    right: 'max(20px, calc((100vw - min(1440px, 100vw)) / 2 + 244px))',
    bottom: '28px'
  };

  return {
    visible: isVisible,
    positionMode: mode,
    ...(mode === 'absolute'
      ? {
          bottom: 18,
          right: 18,
          top: 18
        }
      : {
          style: fixedStyle
        }),
    thumbStyle: {
      boxShadow: '0 0 18px rgba(24, 24, 27, 0.16)'
    }
  } satisfies ImmersiveScrollbarProps;
}

function SceneStatus() {
  const frame = useImmersiveFrame();
  const { progress } = useImmersiveProgress();

  return (
    <div className="demo-status-card">
      <strong>Live preview</strong>
      <span>Progress {Math.round(progress * 100)}%</span>
      <span>
        Frame {Math.min(frame.currentFrame + 1, Math.max(frame.totalFrames, 1))}
        /{Math.max(frame.totalFrames, 1)}
      </span>
    </div>
  );
}

export function DemoPage() {
  const sceneControls = useImmersiveConfigControls({
    initialConfig: {
      debug: { enabled: false },
      scrollbar: {
        enabled: true,
        positionMode: 'absolute'
      }
    }
  });
  const showDebug = sceneControls.config.debug?.enabled ?? false;
  const showScrollbar = sceneControls.config.scrollbar?.enabled ?? true;
  const scrollbarPositionMode: ScrollbarPositionMode =
    sceneControls.config.scrollbar?.positionMode === 'fixed'
      ? 'fixed'
      : 'absolute';
  const scrollbarProps = createDemoScrollbarProps(
    scrollbarPositionMode,
    showScrollbar
  );

  return (
    <DocsFrame
      activeHref="/demo"
      badges={[
        'Live preview',
        'Debug toggle',
        'Scrollbar toggle',
        'Fixed/Absolute rail',
        'Light/Dark ready'
      ]}
      description="This page is the closest thing to a component reference demo. It shows the immersive scene in context, exposes the common toggles people need while integrating it, and keeps the usage guidance next to the live surface."
      eyebrow="Demo"
      navigationLinks={nextDemoNavigationLinks}
      sidebarGroups={demoSidebarGroups}
      title="Immersive Scroll demo"
    >
      <section className="docs-section" id="preview">
        <div className="docs-section__header">
          <h2>Preview</h2>
          <p>
            The preview uses the actual React package surface. The toolbar lets
            you turn the debug overlay and the packaged scrollbar on or off
            without touching internal code.
          </p>
        </div>

        <div className="demo-preview-frame">
          <ImmersiveScroll
            className="demo-scene"
            config={{
              ...landingImmersiveConfig,
              debug: {
                ...landingImmersiveConfig.debug,
                ...sceneControls.config.debug
              },
              scrollbar: {
                ...landingImmersiveConfig.scrollbar,
                ...sceneControls.config.scrollbar
              }
            }}
            framesPath={defaultSceneFramesPath}
            scrollbarProps={scrollbarProps}
            overlay={
              <ImmersiveLayer className="immersive-overlay">
                <div className="landing-vignette demo-scene__vignette" />
                <div className="demo-toolbar">
                  <SceneToolbarButton
                    active={showDebug}
                    icon={Bug}
                    label={showDebug ? 'Hide debug' : 'Show debug'}
                    onClick={() =>
                      sceneControls.updateDebug({
                        enabled: !showDebug
                      })
                    }
                  />
                  <SceneToolbarButton
                    active={showScrollbar}
                    icon={PanelRightDashed}
                    label={showScrollbar ? 'Hide scrollbar' : 'Show scrollbar'}
                    onClick={() =>
                      sceneControls.updateScrollbar({
                        enabled: !showScrollbar
                      })
                    }
                  />
                  <SceneToolbarButton
                    active={scrollbarPositionMode === 'fixed'}
                    icon={Pin}
                    label={
                      scrollbarPositionMode === 'fixed'
                        ? 'Rail: fixed'
                        : 'Rail: absolute'
                    }
                    onClick={() =>
                      sceneControls.updateScrollbar({
                        positionMode:
                          scrollbarPositionMode === 'absolute'
                            ? 'fixed'
                            : 'absolute'
                      })
                    }
                  />
                </div>
                <SceneStatus />
                <div className="demo-source-card">
                  <strong>{landingSource.title}</strong>
                  <span>{landingSource.label}</span>
                  <span>{landingSource.license}</span>
                </div>
              </ImmersiveLayer>
            }
          >
            <div className="demo-scene__content">
              <section className="story-panel story-panel--hero story-panel--left">
                <article
                  className="story-card story-card--hero"
                  data-align="left"
                >
                  <p className="eyebrow">ImmersiveScroll</p>
                  <h2>Pin the viewport and let the story move through it.</h2>
                  <p>
                    This scene uses the frame manifest, the packaged scrollbar,
                    and the optional debug overlay through public props only.
                  </p>
                </article>
              </section>
              <section className="story-panel story-panel--right story-panel--compact">
                <article
                  className="story-card story-card--compact"
                  data-align="right"
                >
                  <p className="eyebrow">Overlay layer</p>
                  <h2>Toolbars, badges, and HUDs live above the scene.</h2>
                  <p>
                    Use <code>{'<ImmersiveLayer />'}</code> to compose controls
                    or design chrome without leaking them into the renderer.
                  </p>
                </article>
              </section>
            </div>
          </ImmersiveScroll>
        </div>
      </section>

      <section className="docs-section" id="install">
        <div className="docs-section__header">
          <h2>Install</h2>
          <p>
            Start with the React adapter and keep the first scene minimal. Once
            the media path and scroll range feel correct, then add polish.
          </p>
        </div>

        <div className="docs-code-grid">
          {docsQuickstartSnippets.slice(0, 2).map((snippet) => (
            <article className="docs-code-card" key={snippet.title}>
              <div className="docs-code-card__header">
                <span className="docs-chip">{snippet.eyebrow}</span>
                <h3>{snippet.title}</h3>
                <p>{snippet.description}</p>
              </div>
              <pre className="code-block">
                <code>{snippet.code}</code>
              </pre>
            </article>
          ))}
        </div>
      </section>

      <section className="docs-section" id="usage">
        <div className="docs-section__header">
          <h2>Usage</h2>
          <p>
            A typical integration has three layers: the root scene, the overlay
            layer, and the story content that defines the scroll span.
          </p>
        </div>

        <div className="docs-card-grid">
          <article className="docs-card">
            <h3>Root scene</h3>
            <p>
              Use <code>{'<ImmersiveScroll />'}</code> for the pinned viewport,
              frame loading, scrollbar rendering, and scene progress mapping.
            </p>
          </article>
          <article className="docs-card">
            <h3>Overlay</h3>
            <p>
              Add status badges, toggles, gradients, or CTA chrome through{' '}
              <code>{'<ImmersiveLayer />'}</code>.
            </p>
          </article>
          <article className="docs-card">
            <h3>Story panels</h3>
            <p>
              The children of the scene determine scroll distance. More panels
              or taller panels create a longer scrub.
            </p>
          </article>
        </div>
      </section>

      <section className="docs-section" id="toolbar">
        <div className="docs-section__header">
          <h2>Toolbar toggles</h2>
          <p>
            These controls are intentionally simple because they mirror the
            things people ask for first while integrating the component.
          </p>
        </div>

        <div className="docs-card-grid">
          <article className="docs-card">
            <h3>Debug toggle</h3>
            <p>
              Switches the packaged debug panel through the public config:
              <code> config.debug.enabled </code>.
            </p>
          </article>
          <article className="docs-card">
            <h3>Scrollbar toggle</h3>
            <p>
              Switches the packaged scrollbar through config or per-instance
              `scrollbarProps.visible`.
            </p>
          </article>
          <article className="docs-card">
            <h3>Position mode</h3>
            <p>
              Flip between `absolute` and `fixed` placement so you can verify
              whether the rail should stay scoped to the scene or lock to the
              viewport.
            </p>
          </article>
        </div>
      </section>

      <section className="docs-section" id="scrollbar">
        <div className="docs-section__header">
          <h2>Scrollbar behavior</h2>
          <p>
            The packaged scrollbar is no longer just decorative. It reads the
            resolved config and can be positioned from config or component props
            without editing internal CSS.
          </p>
        </div>

        <div className="docs-inline-list">
          <span className="docs-chip">config.scrollbar.position</span>
          <span className="docs-chip">config.scrollbar.positionMode</span>
          <span className="docs-chip">
            config.scrollbar.top/right/bottom/left
          </span>
          <span className="docs-chip">scrollbarProps.positionMode</span>
          <span className="docs-chip">
            useImmersiveScrollbar().scrollToProgress()
          </span>
        </div>
      </section>

      <section className="docs-section" id="code">
        <div className="docs-section__header">
          <h2>Code</h2>
          <p>
            This is the shape used by the demo scene. The public controls hook
            keeps the preview declarative while still exposing a typed config
            surface for the toolbar.
          </p>
        </div>

        <pre className="code-block">
          <code>{`const sceneControls = useImmersiveConfigControls({\n  initialConfig: {\n    debug: { enabled: false },\n    scrollbar: { enabled: true, positionMode: 'absolute' }\n  }\n});\n\nconst showDebug = sceneControls.config.debug?.enabled ?? false;\nconst showScrollbar = sceneControls.config.scrollbar?.enabled ?? true;\nconst scrollbarPositionMode =\n  sceneControls.config.scrollbar?.positionMode === 'fixed'\n    ? 'fixed'\n    : 'absolute';\n\n<ImmersiveScroll\n  framesPath="/immersive/scene"\n  config={{\n    debug: {\n      ...defaultConfig.debug,\n      ...sceneControls.config.debug\n    },\n    scrollbar: {\n      ...defaultConfig.scrollbar,\n      ...sceneControls.config.scrollbar\n    }\n  }}\n  scrollbarProps={{\n    visible: showScrollbar,\n    positionMode: scrollbarPositionMode,\n    ...(scrollbarPositionMode === 'absolute'\n      ? { top: 18, right: 18, bottom: 18 }\n      : { style: fixedStyle })\n  }}\n/>`}</code>
        </pre>
      </section>
    </DocsFrame>
  );
}
