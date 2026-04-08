'use client';

import type { ReactNode } from 'react';
import type { SiteLink } from '../landing-content';
import { SiteChrome } from './SiteChrome';

export interface DocsSidebarLink {
  title: string;
  href: string;
}

export interface DocsSidebarGroup {
  title: string;
  links: readonly DocsSidebarLink[];
}

export interface DocsFrameProps {
  activeHref: string;
  navigationLinks: readonly SiteLink[];
  eyebrow: string;
  title: string;
  description: string;
  badges?: readonly string[];
  sidebarGroups: readonly DocsSidebarGroup[];
  sectionLinks?: readonly DocsSidebarLink[];
  children: ReactNode;
}

export function DocsFrame({
  activeHref,
  navigationLinks,
  eyebrow,
  title,
  description,
  badges,
  sidebarGroups,
  sectionLinks,
  children
}: DocsFrameProps) {
  const resolvedSectionLinks =
    sectionLinks ??
    sidebarGroups.flatMap((group) =>
      group.links.map((link) => ({
        title: link.title,
        href: link.href
      }))
    );

  return (
    <SiteChrome activeHref={activeHref} navigationLinks={navigationLinks}>
      <main className="docs-shell">
        <aside className="docs-sidebar">
          <div className="docs-sidebar__inner">
            {sidebarGroups.map((group) => (
              <section className="docs-sidebar__group" key={group.title}>
                <p className="docs-sidebar__title">{group.title}</p>
                <nav className="docs-sidebar__nav" aria-label={group.title}>
                  {group.links.map((link) => (
                    <a className="docs-sidebar__link" href={link.href} key={link.href}>
                      {link.title}
                    </a>
                  ))}
                </nav>
              </section>
            ))}
          </div>
        </aside>

        <div className="docs-main">
          <header className="docs-header">
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="docs-header__description">{description}</p>
            {badges && badges.length > 0 ? (
              <div className="docs-header__badges">
                {badges.map((badge) => (
                  <span className="docs-badge" key={badge}>
                    {badge}
                  </span>
                ))}
              </div>
            ) : null}
          </header>

          <div className="docs-content">{children}</div>
        </div>

        <aside className="docs-toc">
          <div className="docs-toc__inner">
            <p className="docs-sidebar__title">On this page</p>
            <nav className="docs-sidebar__nav" aria-label="On this page">
              {resolvedSectionLinks.map((link) => (
                <a className="docs-sidebar__link" href={link.href} key={link.href}>
                  {link.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      </main>
    </SiteChrome>
  );
}
