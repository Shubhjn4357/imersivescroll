'use client';

import {
  componentReferenceSections,
  configReferenceSections,
  docsOperationalCards,
  docsQuickstartSnippets,
  hookReferenceItems
} from '../reference-content';
import { nextDemoNavigationLinks } from '../landing-content';
import { CodeBlock } from './CodeBlock';
import { DocsFrame, type DocsSidebarGroup } from './DocsFrame';

const docsSidebarGroups: readonly DocsSidebarGroup[] = [
  {
    title: 'Getting started',
    links: [
      { title: 'Introduction', href: '#introduction' },
      { title: 'Installation', href: '#installation' },
      { title: 'Usage flow', href: '#usage-flow' }
    ]
  },
  {
    title: 'API reference',
    links: [
      { title: 'Component props', href: '#component-props' },
      { title: 'Hooks', href: '#hooks' },
      { title: 'Config groups', href: '#config-groups' }
    ]
  },
  {
    title: 'Guidance',
    links: [
      { title: 'Theming', href: '#theming' },
      { title: 'Reliability', href: '#reliability' }
    ]
  }
] as const;

function PropertyTable({
  items
}: {
  items: readonly {
    name: string;
    type: string;
    description: string;
    required?: boolean;
    defaultValue?: string;
  }[];
}) {
  return (
    <div className="docs-property-table">
      {items.map((item) => (
        <article className="docs-property-row" key={item.name}>
          <div className="docs-property-row__header">
            <code>{item.name}</code>
            <span className="docs-property-row__meta">{item.type}</span>
          </div>
          <p>{item.description}</p>
          <div className="docs-inline-list">
            <span className="docs-chip">
              {item.required ? 'Required' : 'Optional'}
            </span>
            {item.defaultValue ? (
              <span className="docs-chip docs-chip--muted">
                Default: {item.defaultValue}
              </span>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

export function DocsPage() {
  return (
    <DocsFrame
      activeHref="/docs"
      badges={['Quick start', 'Props', 'Hooks', 'CLI', 'Copyable snippets']}
      description="The docs are organized like a component reference, not a marketing page. Start with the single-package install, move through the scene lifecycle, then use the hook and prop reference to shape a responsive route shell."
      eyebrow="Documentation"
      navigationLinks={nextDemoNavigationLinks}
      sidebarGroups={docsSidebarGroups}
      title="Immersive Scroll docs"
    >
      <section className="docs-section" id="introduction">
        <div className="docs-section__header">
          <h2>Introduction</h2>
          <p>
            `immersive-scroll` is a scene wrapper for frame-sequence
            storytelling. One package now ships the React runtime, the framework
            adapters, the config-control hook, and the CLI you use to generate
            frame assets. It pins a fixed full-screen viewport by default,
            renders frames on a canvas, and exposes scene state through React
            hooks so overlays and supporting UI stay predictable.
          </p>
        </div>

        <div className="docs-card-grid">
          <article className="docs-card glass-card">
            <span className="docs-chip">Logic</span>
            <h3 style={{ margin: '1rem 0' }}>What it solves</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
              It removes the fragile part of scroll-cinema builds: frame
              loading, progress mapping, viewport pinning, packaged scrollbar
              chrome, and reusable UI state.
            </p>
          </article>
          <article className="docs-card glass-card">
            <span className="docs-chip">Ownership</span>
            <h3 style={{ margin: '1rem 0' }}>What you still own</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
              You still control the art direction, story layout, overlay design,
              responsive page shell, and the route-level content around the
              scene.
            </p>
          </article>
          <article className="docs-card glass-card">
            <span className="docs-chip">Mindset</span>
            <h3 style={{ margin: '1rem 0' }}>How to think about it</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
              Treat the immersive scene like any other component: install it,
              extract assets once, pass typed props, and read state from hooks
              instead of patching internals.
            </p>
          </article>
        </div>
      </section>

      <section className="docs-section" id="installation">
        <div className="docs-section__header">
          <h2>Installation</h2>
          <p>
            Add the public package, prepare the asset directory, and keep the
            first render simple before you layer in motion, custom placement, or
            decorative chrome. Every code sample now has an in-page copy action
            so the docs behave like a reference surface instead of a static
            article.
          </p>
        </div>

        <div className="docs-code-grid">
          {docsQuickstartSnippets.map((snippet) => (
            <article
              className="docs-code-card glass-card"
              key={snippet.title}
              style={{ padding: '1.5rem' }}
            >
              <div
                className="docs-code-card__header"
                style={{ marginBottom: '1.5rem' }}
              >
                <span className="docs-chip">{snippet.eyebrow}</span>
                <h3 style={{ fontSize: '1.25rem', margin: '0.75rem 0' }}>
                  {snippet.title}
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                  {snippet.description}
                </p>
              </div>
              <CodeBlock code={snippet.code} language={snippet.language} />
            </article>
          ))}
        </div>
      </section>

      <section className="docs-section" id="usage-flow">
        <div className="docs-section__header">
          <h2>Usage flow</h2>
          <p>
            The ecosystem provides two primary tools: the core immersive scroll
            engine, and the cinematic SVG reveal mask. Combine them to build
            high-end product surfaces.
          </p>
        </div>

        <div className="docs-card-grid" style={{ marginBottom: '3rem' }}>
          <article className="docs-card glass-card">
            <span className="docs-chip">Core Package</span>
            <h3 style={{ margin: '1rem 0' }}>immersive-scroll</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
              Used for the heavy lifting: unpacking huge frame sequences,
              spinning up WebGL canvases, mapping scroll state, and
              orchestrating the actual hardware scrubbing loop.
            </p>
          </article>
          <article className="docs-card glass-card">
            <span className="docs-chip">Secondary Package</span>
            <h3 style={{ margin: '1rem 0' }}>@immersive-scroll/svg-mask</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
              A lightweight, GSAP-driven reveal mask. Perfect for "before/after"
              shots or transitioning from a dark preamble into a vibrant feature
              section without needing thousands of image frames.
            </p>
          </article>
        </div>

        <ol className="docs-step-list">
          <li>
            Prepare a video or a frame sequence and publish it into a public
            directory with a matching manifest. In this repo the shortest path
            is <code>pnpm extract &quot;./video.mp4&quot;</code>.
          </li>
          <li>
            Build transition zones using <code>{'<ImmersiveSvgMask />'}</code>{' '}
            to elegantly pull the user from a standard webpage shell into the
            immersive format.
          </li>
          <li>
            Mount <code>{'<ImmersiveScroll />'}</code> for the main act. Bind
            overlay UI through <code>{'<ImmersiveLayer />'}</code> and read
            state through hooks like <code>useImmersiveProgress()</code>.
          </li>
          <li>
            Tune the scrollbar, filters, and motion choreography after the base
            scene already feels correct.
          </li>
        </ol>
      </section>

      <section className="docs-section" id="component-props">
        <div className="docs-section__header">
          <h2>Component props</h2>
          <p>
            These are the props most teams touch first. The root scene owns the
            lifecycle, while the helper components keep overlays and triggers
            small.
          </p>
        </div>

        <div
          className="docs-stack"
          style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}
        >
          {componentReferenceSections.map((section) => (
            <article
              className="docs-card docs-card--wide glass-card"
              key={section.title}
              style={{ padding: '0', overflow: 'hidden' }}
            >
              <div
                className="docs-card__header"
                style={{
                  padding: '2.5rem',
                  borderBottom: '1px solid var(--border)'
                }}
              >
                <span className="docs-chip">{section.eyebrow}</span>
                <h3 style={{ fontSize: '1.75rem', margin: '0.75rem 0' }}>
                  {section.title}
                </h3>
                <p style={{ color: 'var(--muted)' }}>{section.description}</p>
              </div>
              <div style={{ padding: '1rem 0' }}>
                <PropertyTable items={section.properties} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="docs-section" id="hooks">
        <div className="docs-section__header">
          <h2>Hooks</h2>
          <p>
            Hooks are the safe way to observe a scene. They keep the overlay
            layer declarative and avoid leaking engine details into every page.
          </p>
        </div>

        <div className="docs-card-grid">
          {hookReferenceItems.map((hook) => (
            <article
              className="docs-card docs-card--code glass-card"
              key={hook.name}
            >
              <div className="docs-card__header">
                <h3>{hook.name}</h3>
                <p
                  style={{
                    color: 'var(--muted)',
                    fontSize: '0.9rem',
                    marginBottom: '1rem'
                  }}
                >
                  {hook.description}
                </p>
              </div>
              <div
                className="docs-inline-list"
                style={{ marginBottom: '1rem' }}
              >
                <span className="docs-chip">{hook.signature}</span>
                <span className="docs-chip docs-chip--muted">
                  {hook.returns}
                </span>
              </div>
              <CodeBlock code={hook.usage} language="tsx" />
              <div className="docs-inline-list" style={{ marginTop: '1rem' }}>
                {hook.notes.map((note) => (
                  <span className="docs-chip docs-chip--muted" key={note}>
                    {note}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="docs-section" id="config-groups">
        <div className="docs-section__header">
          <h2>Config groups</h2>
          <p>
            Keep config changes grouped by responsibility. Input behavior,
            rendering, scrollbar placement, mobile fallbacks, and debug state
            should not be mixed together.
          </p>
        </div>

        <div
          className="docs-stack"
          style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}
        >
          {configReferenceSections.map((section) => (
            <article
              className="docs-card docs-card--wide glass-card"
              key={section.title}
              style={{ padding: '0', overflow: 'hidden' }}
            >
              <div
                className="docs-card__header"
                style={{
                  padding: '2.5rem',
                  borderBottom: '1px solid var(--border)'
                }}
              >
                <span className="docs-chip">{section.eyebrow}</span>
                <h3 style={{ fontSize: '1.75rem', margin: '0.75rem 0' }}>
                  {section.title}
                </h3>
                <p style={{ color: 'var(--muted)' }}>{section.description}</p>
              </div>
              <div style={{ padding: '1rem 0' }}>
                <PropertyTable items={section.properties} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="docs-section" id="theming">
        <div className="docs-section__header">
          <h2>Theming</h2>
          <p>
            The demo site now supports light and dark mode. The package itself
            stays theme-agnostic, so the scene chrome should inherit from your
            design system instead of shipping hard-coded page colors. Build the
            route shell mobile-first with flex and grid, then let the immersive
            component fill that shell.
          </p>
        </div>

        <div className="docs-card-grid">
          <article className="docs-card">
            <h3>Prefer variables</h3>
            <p>
              Drive overlay surfaces, rails, typography, and borders from CSS
              variables so theme changes do not require component rewrites.
            </p>
          </article>
          <article className="docs-card">
            <h3>Keep media neutral</h3>
            <p>
              Let the theme change the shell. The actual frames or video should
              stay art-directed for the story itself, not the app theme.
            </p>
          </article>
        </div>
      </section>

      <section className="docs-section" id="reliability">
        <div className="docs-section__header">
          <h2>Reliability</h2>
          <p>
            Most production bugs come from asset volume, SSR boundaries,
            viewport placement drift, unsmoothed progress mapping, or
            interactive chrome that was styled outside the config system.
          </p>
        </div>

        <div className="docs-card-grid">
          {docsOperationalCards.map((card) => (
            <article className="docs-card glass-card" key={card.title}>
              <h3 style={{ marginBottom: '1rem' }}>{card.title}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </DocsFrame>
  );
}
