'use client';

import type { ReactNode } from 'react';
import { useRef } from 'react';
import {
  ImmersiveLayer,
  ImmersiveScroll,
  useImmersiveFrame,
  useImmersiveProgress
} from 'immersive-scroll';
import {
  defaultLandingActions,
  defaultLandingDestinationCards,
  defaultLandingNavigationLinks,
  landingFeatureCards,
  landingHero,
  landingImmersiveConfig,
  landingMetrics,
  landingSections,
  landingSource,
  type DestinationCard,
  type SiteLink
} from '../landing-content';
import { SiteChrome } from './SiteChrome';

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

export interface ImmersiveLandingProps {
  runtimeLabel: string;
  showDebug: boolean;
  showScrollbar: boolean;
  onToggleDebug: () => void;
  onToggleScrollbar: () => void;
  footer?: ReactNode;
  navigationLinks?: readonly SiteLink[];
  actionLinks?: readonly SiteLink[];
  destinationCards?: readonly DestinationCard[];
  activeHref?: string;
}

function HomeSceneStatus() {
  const frame = useImmersiveFrame();
  const { progress } = useImmersiveProgress();

  return (
    <div className="demo-status-card">
      <strong>Home preview</strong>
      <span>Progress {Math.round(progress * 100)}%</span>
      <span>
        Frame {Math.min(frame.currentFrame + 1, Math.max(frame.totalFrames, 1))}
        /{Math.max(frame.totalFrames, 1)}
      </span>
    </div>
  );
}

export function ImmersiveLanding({
  runtimeLabel,
  showDebug,
  showScrollbar,
  onToggleDebug,
  onToggleScrollbar,
  footer,
  navigationLinks = defaultLandingNavigationLinks,
  actionLinks = defaultLandingActions,
  destinationCards = defaultLandingDestinationCards,
  activeHref = '/'
}: ImmersiveLandingProps) {
  const scopeRef = useRef<HTMLElement>(null);

  return (
    <SiteChrome
      activeHref={activeHref}
      navigationLinks={navigationLinks}
      footer={footer}
    >
      <main className="home-shell" ref={scopeRef}>
        <section className="home-hero">
          <div className="home-hero__copy">
            <span className="docs-chip">{runtimeLabel}</span>
            <h1>{landingHero.title}</h1>
            <p>{landingHero.description}</p>

            <div className="docs-inline-list">
              {actionLinks.map((action) => (
                <a
                  className={`site-nav__link${
                    action.accent ? ' site-nav__link--accent' : ''
                  }`}
                  href={action.href}
                  key={action.href}
                >
                  {action.label}
                </a>
              ))}
            </div>

            <div className="docs-inline-list">
              {landingMetrics.map((metric) => (
                <span className="docs-chip docs-chip--muted" key={metric.label}>
                  {metric.label}: {metric.value}
                </span>
              ))}
            </div>
          </div>

          <aside className="home-hero__aside">
            <article className="docs-card">
              <h3>One package, multiple surfaces</h3>
              <p>
                Use the home page for the overall story, the docs for the API,
                the demo for the live component preview, and the playground for
                tuning.
              </p>
            </article>
            <article className="docs-code-card">
              <div className="docs-code-card__header">
                <span className="docs-chip">Install</span>
                <h3>Start with the public package</h3>
              </div>
              <pre className="code-block">
                <code>pnpm add immersive-scroll gsap</code>
              </pre>
            </article>
          </aside>
        </section>

        <section className="home-preview" id="demo">
          <div className="docs-section__header">
            <h2>Live scene preview</h2>
            <p>
              The home page keeps one premium scene, but the surrounding UI now
              behaves like a component site instead of a one-off launch page.
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
                right: 18,
                top: 18,
                bottom: 18
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
                      onClick={onToggleDebug}
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
                      onClick={onToggleScrollbar}
                    >
                      <ScrollbarIcon />
                      <span>
                        {showScrollbar ? 'Hide scrollbar' : 'Show scrollbar'}
                      </span>
                    </button>
                  </div>
                  <HomeSceneStatus />
                  <div className="demo-source-card">
                    <strong>{landingSource.title}</strong>
                    <span>{landingSource.label}</span>
                    <span>{landingSource.license}</span>
                  </div>
                </ImmersiveLayer>
              }
            >
              <div className="demo-scene__content">
                {landingSections.slice(0, 2).map((section) => (
                  <section
                    className={`story-panel story-panel--${section.align} story-panel--compact`}
                    key={section.id}
                  >
                    <article
                      className="story-card story-card--compact"
                      data-align={section.align}
                    >
                      <p className="eyebrow">{section.eyebrow}</p>
                      <h2>{section.title}</h2>
                      <p>{section.description}</p>
                    </article>
                  </section>
                ))}
              </div>
            </ImmersiveScroll>
          </div>
        </section>

        <section className="home-grid">
          <div className="docs-section__header">
            <h2>Start from the right page</h2>
            <p>
              Each route exists for a different job, so the package site reads
              more like product documentation and less like a single landing.
            </p>
          </div>

          <div className="docs-card-grid">
            {destinationCards.map((card) => (
              <a className="docs-card" href={card.href} key={card.title}>
                <span className="docs-chip">{card.eyebrow}</span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="home-grid" id="features">
          <div className="docs-section__header">
            <h2>Feature highlights</h2>
            <p>
              The package handles the parts that usually become inconsistent
              first: frame scrubbing, overlays, custom chrome, and adapter
              parity.
            </p>
          </div>

          <div className="docs-card-grid">
            {landingFeatureCards.map((featureCard) => (
              <article className="docs-card" key={featureCard.title}>
                <h3>{featureCard.title}</h3>
                <p>{featureCard.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
