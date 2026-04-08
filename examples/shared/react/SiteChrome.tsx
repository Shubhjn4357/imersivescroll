import type { ReactNode } from 'react';
import type { SiteLink } from '../landing-content';
import { useSiteTheme } from './SiteThemeProvider';

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      className="icon-button__icon"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      className="icon-button__icon"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2.5v2.3M12 19.2v2.3M4.8 4.8l1.6 1.6M17.6 17.6l1.6 1.6M2.5 12h2.3M19.2 12h2.3M4.8 19.2l1.6-1.6M17.6 6.4l1.6-1.6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export interface SiteChromeProps {
  activeHref: string;
  navigationLinks: readonly SiteLink[];
  children: ReactNode;
  footer?: ReactNode;
}

export function SiteChrome({
  activeHref,
  navigationLinks,
  children,
  footer
}: SiteChromeProps) {
  const { theme, toggleTheme } = useSiteTheme();

  return (
    <div className="site-chrome">
      <div className="site-backdrop" aria-hidden="true">
        <div className="site-orb site-orb--one" data-reveal="float" />
        <div className="site-orb site-orb--two" data-reveal="float" />
        <div className="site-orb site-orb--three" data-reveal="float" />
        <div className="site-grid" />
      </div>

      <header className="site-nav">
        <a className="site-brand" href="/">
          <span className="site-brand__eyebrow">Immersive Scroll</span>
          <strong>immersive-scroll</strong>
        </a>

        <div className="site-nav__controls">
          <nav className="site-nav__links" aria-label="Primary">
            {navigationLinks.map((link) => {
              const isActive = activeHref === link.href;

              return (
                <a
                  key={link.href}
                  className={`site-nav__link${
                    isActive ? ' site-nav__link--active' : ''
                  }${link.accent ? ' site-nav__link--accent' : ''}`}
                  href={link.href}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <button
            aria-label={
              theme === 'dark'
                ? 'Switch to light theme'
                : 'Switch to dark theme'
            }
            className="icon-button"
            type="button"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </header>

      {children}

      <footer className="site-footer">
        <span>Shared design source for Next.js, React, Solid, and Web.</span>
        {footer ?? (
          <span>
            Use `pnpm dev:landing` to iterate on the primary site surface.
          </span>
        )}
      </footer>
    </div>
  );
}
