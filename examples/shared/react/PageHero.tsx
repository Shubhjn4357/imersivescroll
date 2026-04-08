import type { ReactNode } from 'react';
import type { SiteLink } from '../landing-content';

export interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  badges?: readonly string[];
  actions?: readonly SiteLink[];
  aside?: ReactNode;
}

export function PageHero({
  eyebrow,
  title,
  description,
  badges,
  actions,
  aside
}: PageHeroProps) {
  return (
    <section className="page-hero glass-panel" data-trigger="section">
      <div className="page-hero__copy">
        <p className="eyebrow" data-reveal="intro">
          {eyebrow}
        </p>
        <h1 data-reveal="intro">{title}</h1>
        <p className="page-hero__description" data-reveal="intro">
          {description}
        </p>

        {actions && actions.length > 0 ? (
          <div className="page-hero__actions" data-reveal="intro">
            {actions.map((action) => (
              <a
                key={action.href}
                className={`action-pill${
                  action.accent ? ' action-pill--accent' : ''
                }`}
                href={action.href}
              >
                {action.label}
              </a>
            ))}
          </div>
        ) : null}

        {badges && badges.length > 0 ? (
          <div className="page-hero__badges" data-reveal="intro">
            {badges.map((badge) => (
              <span className="info-pill" key={badge}>
                {badge}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {aside ? <aside className="page-hero__aside">{aside}</aside> : null}
    </section>
  );
}
