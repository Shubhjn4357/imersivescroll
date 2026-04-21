'use client';

import {
  playgroundCodeSnippets,
  playgroundImplementationModes,
  playgroundStackCards,
  nextDemoNavigationLinks
} from '../landing-content';
import { CodeBlock } from './CodeBlock';
import { DocsFrame, type DocsSidebarGroup } from './DocsFrame';
import { PlaygroundWorkbench } from './PlaygroundWorkbench';
import { HorizontalScrollDemo } from './HorizontalScrollDemo';
import { SvgMaskDemo } from './SvgMaskDemo';
import { useState } from 'react';

const playgroundSidebarGroups: readonly DocsSidebarGroup[] = [
  {
    title: 'Workbench',
    links: [
      { title: 'Overview', href: '#overview' },
      { title: 'Controls', href: '#controls' },
      { title: 'Implementation modes', href: '#implementation-modes' }
    ]
  },
  {
    title: 'Modules',
    links: [
      { title: 'Horizontal Scroll', href: '#overview' },
      { title: 'SVG Mask Reveal', href: '#overview' }
    ]
  },
  {
    title: 'Reference',
    links: [
      { title: 'Library stack', href: '#library-stack' },
      { title: 'Code', href: '#code' }
    ]
  }
] as const;

export function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState<
    'sequence' | 'horizontal' | 'mask'
  >('sequence');

  return (
    <DocsFrame
      activeHref="/playground"
      badges={[
        'Contained preview',
        'Multi-package QA',
        'Horizontal translation',
        'SVG Mask reveal',
        'Config snapshot'
      ]}
      description="The playground is the package QA surface. Switch between the core engine, horizontal scroll, and SVG mask packages to tune your motion and visual fidelity."
      eyebrow="Playground"
      navigationLinks={nextDemoNavigationLinks}
      sidebarGroups={playgroundSidebarGroups}
      title="Scene playground"
    >
      <section className="docs-section" id="overview">
        <div className="docs-section__header" style={{ marginBottom: '2rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <h2>Overview</h2>
              <p style={{ maxWidth: '600px' }}>
                Use the playground to tune your scrollytelling. Switch between
                modules to test specific motion patterns and configurations.
              </p>
            </div>

            <div
              className="docs-inline-list"
              style={{
                padding: '0.25rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '0.5rem',
                border: '1px solid var(--border)'
              }}
            >
              <button
                className={`docs-chip ${activeTab === 'sequence' ? 'docs-chip--accent' : 'docs-chip--outline'}`}
                style={{ cursor: 'pointer', border: 'none' }}
                onClick={() => setActiveTab('sequence')}
              >
                Sequence
              </button>
              <button
                className={`docs-chip ${activeTab === 'horizontal' ? 'docs-chip--accent' : 'docs-chip--outline'}`}
                style={{ cursor: 'pointer', border: 'none' }}
                onClick={() => setActiveTab('horizontal')}
              >
                Horizontal
              </button>
              <button
                className={`docs-chip ${activeTab === 'mask' ? 'docs-chip--accent' : 'docs-chip--outline'}`}
                style={{ cursor: 'pointer', border: 'none' }}
                onClick={() => setActiveTab('mask')}
              >
                SVG Mask
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'sequence' && <PlaygroundWorkbench />}

        {activeTab === 'horizontal' && (
          <div
            id="horizontal-demo"
            className="glass-card"
            style={{ overflow: 'hidden' }}
          >
            <HorizontalScrollDemo />
          </div>
        )}

        {activeTab === 'mask' && (
          <div
            id="mask-demo"
            className="glass-card"
            style={{ overflow: 'hidden' }}
          >
            <SvgMaskDemo />
          </div>
        )}
      </section>

      <section className="docs-section" id="library-stack">
        <div className="docs-section__header">
          <h2>Library stack</h2>
          <p>
            These are the layers behind the workbench and the production scene.
            The preview consumes the shipped package surface instead of custom
            example-only state.
          </p>
        </div>

        <div className="docs-card-grid">
          {playgroundStackCards.map((card) => (
            <article className="docs-card" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="docs-section" id="implementation-modes">
        <div className="docs-section__header">
          <h2>Implementation modes</h2>
          <p>
            The playground compares the two common scene delivery strategies so
            you can choose the one that fits your quality and performance
            budget, then tune the resulting config in the same bounded shell.
          </p>
        </div>

        <div className="docs-stack">
          {playgroundImplementationModes.map((collection) => (
            <article
              className="docs-card docs-card--wide"
              key={collection.title}
            >
              <div className="docs-card__header">
                <span className="docs-chip">{collection.eyebrow}</span>
                <h3>{collection.title}</h3>
                <p>{collection.description}</p>
              </div>
              <div className="docs-card-grid">
                {collection.items.map((item) => (
                  <div className="docs-card docs-card--nested" key={item.title}>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="docs-section" id="controls">
        <div className="docs-section__header">
          <h2>Controls</h2>
          <p>
            The bottom dock maps directly to
            <code> useImmersiveConfigControls() </code>
            plus the preview-only scroll span. Tune the values here, then paste
            the config snapshot into a real route. The workbench now also
            exposes the shipped smooth-scrub and debug-HUD controls so QA can
            validate motion feel before leaving the page.
          </p>
        </div>

        <div className="docs-inline-list">
          <span className="docs-chip">overlayOpacity</span>
          <span className="docs-chip">scroll.smooth</span>
          <span className="docs-chip">scroll.lerp</span>
          <span className="docs-chip">scroll.duration</span>
          <span className="docs-chip">brightness</span>
          <span className="docs-chip">contrast</span>
          <span className="docs-chip">saturate</span>
          <span className="docs-chip">objectFit</span>
          <span className="docs-chip">debug HUD</span>
          <span className="docs-chip">scrollbar thumbColor</span>
          <span className="docs-chip">scroll span</span>
        </div>
      </section>

      <section className="docs-section" id="code">
        <div className="docs-section__header">
          <h2>Code</h2>
          <p>
            These snippets mirror the hook-driven structures behind the
            workbench, the demo route, and the shipped CLI workflow.
          </p>
        </div>

        <div className="docs-code-grid">
          {playgroundCodeSnippets.map((snippet) => (
            <article className="docs-code-card" key={snippet.title}>
              <div className="docs-code-card__header">
                <span className="docs-chip">{snippet.eyebrow}</span>
                <h3>{snippet.title}</h3>
                <p>{snippet.description}</p>
              </div>
              <CodeBlock code={snippet.code} language={snippet.language} />
            </article>
          ))}
        </div>
      </section>
    </DocsFrame>
  );
}
