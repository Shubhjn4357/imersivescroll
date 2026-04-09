import type { ReactNode } from 'react';
import { MoonStar, SunMedium } from 'lucide-react';
import type { SiteLink } from '../landing-content';
import { useSiteTheme } from './SiteThemeProvider';

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
            {theme === 'dark' ? (
              <SunMedium
                aria-hidden="true"
                className="icon-button__icon"
                strokeWidth={1.85}
              />
            ) : (
              <MoonStar
                aria-hidden="true"
                className="icon-button__icon"
                strokeWidth={1.85}
              />
            )}
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
