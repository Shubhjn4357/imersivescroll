'use client';

import type { ReactNode } from 'react';
import { useRef } from 'react';
import { Bug, PanelRightDashed, Pin } from 'lucide-react';
import {
  ImmersiveLayer,
  ImmersiveScroll,
  useImmersiveFrame,
  useImmersiveProgress
} from 'immersive-scroll';
import { ImmersiveSvgMask } from '@immersive-scroll/svg-mask';
import {
  defaultSceneFramesPath,
  landingHero,
  landingImmersiveConfig,
  landingSections,
  landingSource,
  type SiteLink,
  type DestinationCard
} from '../landing-content';
import { SceneToolbarButton } from './SceneToolbarButton';
import { SiteChrome } from './SiteChrome';

type ScrollbarPositionMode = 'absolute' | 'fixed';

export interface ImmersiveLandingProps {
  runtimeLabel: string;
  showDebug: boolean;
  showScrollbar: boolean;
  scrollbarPositionMode: ScrollbarPositionMode;
  onToggleDebug: () => void;
  onToggleScrollbar: () => void;
  onToggleScrollbarPositionMode: () => void;
  footer?: ReactNode;
  activeHref?: string;
  navigationLinks?: readonly SiteLink[];
  actionLinks?: readonly SiteLink[];
  destinationCards?: readonly DestinationCard[];
}

function StatusCard() {
  const frame = useImmersiveFrame();
  const { progress } = useImmersiveProgress();

  return (
    <div className="demo-status-card">
      <span
        className="text-accent"
        style={{ fontSize: '0.7rem', marginBottom: '4px' }}
      >
        System Active
      </span>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div>
          <small style={{ color: 'var(--muted)', display: 'block' }}>
            Progress
          </small>
          <strong>{Math.round(progress * 100)}%</strong>
        </div>
        <div>
          <small style={{ color: 'var(--muted)', display: 'block' }}>
            Frame
          </small>
          <strong>
            {frame.currentFrame} / {frame.totalFrames}
          </strong>
        </div>
      </div>
    </div>
  );
}

export function ImmersiveLanding({
  runtimeLabel,
  showDebug,
  showScrollbar,
  scrollbarPositionMode,
  onToggleDebug,
  onToggleScrollbar,
  onToggleScrollbarPositionMode,
  footer,
  activeHref = '/'
}: ImmersiveLandingProps) {
  const scopeRef = useRef<HTMLElement>(null);

  return (
    <SiteChrome activeHref={activeHref} footer={footer}>
      <main
        className="home-shell"
        ref={scopeRef}
        style={{ padding: 0, maxWidth: 'none', position: 'relative' }}
      >
        {/* Animated Background Grid */}
        <div className="site-grid" />

        {/* Premium Hero Section */}
        <section
          className="story-panel story-panel-center"
          style={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
            <span className="text-accent">{runtimeLabel} Edition</span>
            <h1 className="text-hero">{landingHero.title}</h1>
            <p className="text-subtitle" style={{ margin: '0 auto 2rem' }}>
              {landingHero.description}
            </p>
            <div
              style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}
            >
              <a href="#demo" className="cta-button">
                Explore Engine
              </a>
              <a href="/docs" className="ghost-button">
                Documentation
              </a>
            </div>
          </div>
        </section>

        {/* Feature Grid with Glassmorphism */}
        <section
          style={{
            padding: '4rem 2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            maxWidth: '1200px',
            margin: '0 auto'
          }}
        >
          <article className="docs-card glass-card">
            <span className="text-accent">01</span>
            <h3>Exploded View Engine</h3>
            <p className="text-subtitle" style={{ fontSize: '1rem' }}>
              Transform complex products into interactive 3D stories with
              frame-perfect scrubbing.
            </p>
          </article>
          <article className="docs-card glass-card">
            <span className="text-accent">02</span>
            <h3>Pure Performance</h3>
            <p className="text-subtitle" style={{ fontSize: '1rem' }}>
              Hardware-accelerated canvas rendering with intelligent frame
              preloading and eviction.
            </p>
          </article>
          <article className="docs-card glass-card">
            <span className="text-accent">03</span>
            <h3>Cross-Adapter</h3>
            <p className="text-subtitle" style={{ fontSize: '1rem' }}>
              Unified engine logic with native adapters for React, Next.js,
              Solid, and Vanilla Web.
            </p>
          </article>
        </section>

        {/* SVG Mask Reveal Section */}
        <section style={{ padding: '0', overflow: 'hidden' }}>
          <ImmersiveSvgMask
            scrollDistance={1600}
            variant="pill"
            softness={8}
            parallax={0.2}
            background={
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#0a0a0a',
                  color: 'rgba(255,255,255,0.1)',
                  overflow: 'hidden'
                }}
              >
                <h2
                  style={{
                    fontSize: 'clamp(3rem, 12vw, 8rem)',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '-0.05em'
                  }}
                >
                  The Core.
                </h2>
              </div>
            }
            foreground={
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, var(--accent), #002244)',
                  color: 'white',
                  textAlign: 'center',
                  padding: '2rem',
                  boxSizing: 'border-box',
                  overflow: 'hidden'
                }}
              >
                <span
                  className="text-accent"
                  style={{
                    color: 'white',
                    opacity: 0.8,
                    fontSize: 'clamp(0.6rem, 1.5vw, 0.8rem)',
                    marginBottom: '0.5rem'
                  }}
                >
                  Mask Reveal System
                </span>
                <h2
                  className="text-hero"
                  style={{
                    fontSize: 'clamp(1.5rem, 3.5vw, 3rem)',
                    margin: '0 0 1rem',
                    padding: '0 1rem',
                    maxWidth: '100%'
                  }}
                >
                  Engineered for Narrative.
                </h2>
                <p
                  className="text-subtitle"
                  style={{
                    color: 'white',
                    maxWidth: '420px',
                    margin: '0 auto',
                    padding: '0 1rem',
                    fontSize: 'clamp(0.85rem, 1vw, 1.1rem)'
                  }}
                >
                  Our standalone reveal system allows you to build complex,
                  scroll-driven masks without manually managing coordinates.
                </p>
              </div>
            }
          />
        </section>

        {/* Main Demo Section */}
        <section
          className="home-preview"
          id="demo"
          style={{ padding: '8rem 0' }}
        >
          <div
            className="demo-preview-frame"
            style={{ width: '90vw', margin: '0 auto', position: 'relative' }}
          >
            <ImmersiveScroll
              className="demo-scene"
              config={{
                ...landingImmersiveConfig,
                debug: { enabled: showDebug },
                scrollbar: {
                  enabled: showScrollbar,
                  positionMode: scrollbarPositionMode
                }
              }}
              viewportProps={{ position: 'sticky', top: 0 }}
              framesPath={defaultSceneFramesPath}
              overlay={
                <ImmersiveLayer className="immersive-overlay">
                  <div className="landing-vignette" />

                  {/* Toolbar */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '2rem',
                      right: '2rem',
                      display: 'flex',
                      gap: '0.5rem',
                      pointerEvents: 'auto'
                    }}
                  >
                    <SceneToolbarButton
                      active={showDebug}
                      icon={Bug}
                      label="Debug"
                      onClick={onToggleDebug}
                    />
                    <SceneToolbarButton
                      active={showScrollbar}
                      icon={PanelRightDashed}
                      label="Scroll"
                      onClick={onToggleScrollbar}
                    />
                    <SceneToolbarButton
                      active={scrollbarPositionMode === 'fixed'}
                      icon={Pin}
                      label="Pin"
                      onClick={onToggleScrollbarPositionMode}
                    />
                  </div>

                  {/* Status Overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '2rem',
                      left: '2rem',
                      pointerEvents: 'auto'
                    }}
                  >
                    <StatusCard />
                  </div>

                  {/* Source Attribution */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '2rem',
                      right: '2rem',
                      textAlign: 'right'
                    }}
                  >
                    <small className="text-muted" style={{ opacity: 0.6 }}>
                      ENGINE v0.1.1
                    </small>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                      {landingSource.title}
                    </p>
                  </div>
                </ImmersiveLayer>
              }
            >
              {/* Narrative Panels inside the Scroll Area */}
              <div className="demo-scene__content">
                {landingSections.map((section) => (
                  <section
                    className={`story-panel story-panel--${section.align}`}
                    key={section.id}
                  >
                    <article
                      className="story-card glass-card"
                      style={{
                        maxWidth: '420px',
                        background: 'rgba(5,5,5,0.4)'
                      }}
                    >
                      <span
                        className="text-accent"
                        style={{ fontSize: '0.7rem' }}
                      >
                        {section.eyebrow}
                      </span>
                      <h2 style={{ fontSize: '2.25rem', margin: '0.75rem 0' }}>
                        {section.title}
                      </h2>
                      <p
                        className="text-subtitle"
                        style={{ fontSize: '1.05rem' }}
                      >
                        {section.description}
                      </p>
                    </article>
                  </section>
                ))}
              </div>
            </ImmersiveScroll>
          </div>
        </section>

        {/* Footer Info */}
        <section
          style={{
            padding: '8rem 2rem',
            textAlign: 'center',
            borderTop: '1px solid var(--border)'
          }}
        >
          <h2 className="text-title">Ready to build?</h2>
          <p className="text-subtitle" style={{ margin: '0 auto 2rem' }}>
            Start creating cinematic scroll experiences today with our CLI and
            framework adapters.
          </p>
          <a
            href="https://github.com/Shubhjn4357/imersivescroll"
            className="cta-button"
          >
            View on GitHub
          </a>
        </section>
      </main>
    </SiteChrome>
  );
}
