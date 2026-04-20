'use client';

import type { ReactNode } from 'react';
import type { SiteLink } from '../landing-content';
import '../landing.css';

export interface SiteChromeProps {
  activeHref: string;
  children: ReactNode;
  footer?: ReactNode;
  navigationLinks?: readonly SiteLink[];
}

export function SiteChrome({ activeHref, children, footer }: SiteChromeProps) {
  return (
    <div className="site-chrome">
      <header className="site-nav">
        <a className="site-brand" href="/">
          <span
            className="text-accent"
            style={{ fontSize: '0.65rem', margin: 0 }}
          >
            IMMERSIBLE SCROLL
          </span>
          <strong>immersive-scroll</strong>
        </a>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <nav style={{ display: 'flex', gap: '1.5rem' }}>
            <a
              href="/"
              className={activeHref === '/' ? 'text-accent' : ''}
              style={{
                fontSize: '0.9rem',
                fontWeight: 500,
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              Home
            </a>
            <a
              href="/docs"
              className={activeHref === '/docs' ? 'text-accent' : ''}
              style={{
                fontSize: '0.9rem',
                fontWeight: 500,
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              Docs
            </a>
            <a
              href="/playground"
              className={activeHref === '/playground' ? 'text-accent' : ''}
              style={{
                fontSize: '0.9rem',
                fontWeight: 500,
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              Playground
            </a>
          </nav>

          <a
            href="https://github.com/Shubhjn4357/imersivescroll"
            className="ghost-button"
            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
          >
            v0.1.1
          </a>
        </div>
      </header>

      {children}

      <footer
        className="site-footer"
        style={{
          borderTop: '1px solid var(--border)',
          background: 'rgba(255,255,255,0.02)'
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', gap: '2rem' }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>
              © 2026 Immersive Scroll
            </span>
            <a href="#" style={{ fontSize: '0.8rem', opacity: 0.5 }}>
              Privacy
            </a>
            <a href="#" style={{ fontSize: '0.8rem', opacity: 0.5 }}>
              Terms
            </a>
          </div>
          {footer ?? (
            <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>
              Powered by immersive-scroll engine
            </span>
          )}
        </div>
      </footer>
    </div>
  );
}
