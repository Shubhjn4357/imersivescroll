'use client';

import { useState } from 'react';
import {
  ImmersiveLayer,
  ImmersiveScroll,
  useImmersiveFrame,
  useImmersiveProgress
} from 'immersive-scroll';
import {
  landingImmersiveConfig,
  landingSource,
  nextDemoNavigationLinks
} from '../landing-content';
import { docsQuickstartSnippets } from '../reference-content';
import { DocsFrame, type DocsSidebarGroup } from './DocsFrame';

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

function BugIcon() {
  return (
    <svg
      aria-hidden="true"
      className="icon-button__icon"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M9 7.5V5.8A3 3 0 0 1 12 3a3 3 0 0 1 3 2.8v1.7M6.8 9h10.4M8 13h8M9 17h6M5 9l-2-2M19 9l2-2M5 15l-2 2M19 15l2 2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ScrollbarIcon() {
  return (
    <svg
      aria-hidden="true"
      className="icon-button__icon"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M18 4.5v15M18 9.5h-2.5a1.5 1.5 0 0 0-1.5 1.5v2a1.5 1.5 0 0 0 1.5 1.5H18M8 6.5H6a1.5 1.5 0 0 0-1.5 1.5v8A1.5 1.5 0 0 0 6 17.5h2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
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
  const [showDebug, setShowDebug] = useState(false);
  const [showScrollbar, setShowScrollbar] = useState(true);

  return (
    <DocsFrame
      activeHref="/demo"
      badges={[
        'Live preview',
        'Debug toggle',
        'Scrollbar toggle',
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
                enabled: showDebug
              },
              scrollbar: {
                ...landingImmersiveConfig.scrollbar,
                enabled: showScrollbar
              }
            }}
            framesPath="/immersive/ocean"
            scrollbarProps={{
              visible: showScrollbar,
              thumbStyle: {
                boxShadow: '0 0 18px rgba(24, 24, 27, 0.16)'
              }
            }}
            overlay={
              <ImmersiveLayer className="immersive-overlay">
                <div className="landing-vignette demo-scene__vignette" />
                <div className="demo-toolbar">
                  <button
                    aria-pressed={showDebug}
                    className={`demo-toolbar__button${
                      showDebug ? ' demo-toolbar__button--active' : ''
                    }`}
                    type="button"
                    onClick={() => setShowDebug((value) => !value)}
                  >
                    <BugIcon />
                    <span>{showDebug ? 'Hide debug' : 'Show debug'}</span>
                  </button>
                  <button
                    aria-pressed={showScrollbar}
                    className={`demo-toolbar__button${
                      showScrollbar ? ' demo-toolbar__button--active' : ''
                    }`}
                    type="button"
                    onClick={() => setShowScrollbar((value) => !value)}
                  >
                    <ScrollbarIcon />
                    <span>
                      {showScrollbar ? 'Hide scrollbar' : 'Show scrollbar'}
                    </span>
                  </button>
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
            This is the shape used by the demo scene. It keeps the live preview
            declarative and exposes the toggles through regular React state.
          </p>
        </div>

        <pre className="code-block">
          <code>{`const [showDebug, setShowDebug] = useState(false);\nconst [showScrollbar, setShowScrollbar] = useState(true);\n\n<ImmersiveScroll\n  framesPath="/immersive/ocean"\n  config={{\n    debug: { enabled: showDebug },\n    scrollbar: { enabled: showScrollbar, positionMode: 'absolute' }\n  }}\n  scrollbarProps={{\n    visible: showScrollbar,\n    right: 20,\n    top: 20,\n    bottom: 20\n  }}\n  overlay={<ImmersiveLayer>{/* toolbar + status */}</ImmersiveLayer>}\n>\n  {/* story panels */}\n</ImmersiveScroll>`}</code>
        </pre>
      </section>
    </DocsFrame>
  );
}
