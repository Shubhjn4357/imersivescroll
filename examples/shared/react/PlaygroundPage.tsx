'use client';

import {
  playgroundCodeSnippets,
  playgroundImplementationModes,
  playgroundStackCards,
  nextDemoNavigationLinks
} from '../landing-content';
import { DocsFrame, type DocsSidebarGroup } from './DocsFrame';
import { PlaygroundWorkbench } from './PlaygroundWorkbench';

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
    title: 'Reference',
    links: [
      { title: 'Library stack', href: '#library-stack' },
      { title: 'Code', href: '#code' }
    ]
  }
] as const;

export function PlaygroundPage() {
  return (
    <DocsFrame
      activeHref="/playground"
      badges={['Contained preview', 'Live controls', 'Config snapshot']}
      description="The playground is for tuning and QA. It keeps the scene inside a bounded preview so you can adjust filters, scrollbar settings, and scroll span without moving the entire route."
      eyebrow="Playground"
      navigationLinks={nextDemoNavigationLinks}
      sidebarGroups={playgroundSidebarGroups}
      title="Scene playground"
    >
      <section className="docs-section" id="overview">
        <div className="docs-section__header">
          <h2>Overview</h2>
          <p>
            Use the playground when you want to tune the scene like a component
            author, not like a page reader. The preview is intentionally
            contained so design and implementation changes are easier to review.
          </p>
        </div>

        <PlaygroundWorkbench />
      </section>

      <section className="docs-section" id="library-stack">
        <div className="docs-section__header">
          <h2>Library stack</h2>
          <p>
            These are the moving parts behind the preview and the production
            scene.
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
            you can choose the one that fits your quality and performance budget.
          </p>
        </div>

        <div className="docs-stack">
          {playgroundImplementationModes.map((collection) => (
            <article className="docs-card docs-card--wide" key={collection.title}>
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
            The bottom dock in the workbench maps directly to visual and
            scrollbar props you can pass into the package.
          </p>
        </div>

        <div className="docs-inline-list">
          <span className="docs-chip">overlayOpacity</span>
          <span className="docs-chip">brightness</span>
          <span className="docs-chip">contrast</span>
          <span className="docs-chip">saturate</span>
          <span className="docs-chip">objectFit</span>
          <span className="docs-chip">scrollbar thumbColor</span>
          <span className="docs-chip">scroll span</span>
        </div>
      </section>

      <section className="docs-section" id="code">
        <div className="docs-section__header">
          <h2>Code</h2>
          <p>
            These snippets mirror the structures behind the workbench and the
            main site demo.
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
              <pre className="code-block">
                <code>{snippet.code}</code>
              </pre>
            </article>
          ))}
        </div>
      </section>
    </DocsFrame>
  );
}
