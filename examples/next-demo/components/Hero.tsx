'use client';

import { useState } from 'react';
import {
  nextDemoNavigationLinks,
  nextLandingActions,
  nextLandingDestinationCards
} from '../../shared/landing-content';
import { ImmersiveLanding } from '../../shared/react/ImmersiveLanding';

interface HeroProps {
  runtimeLabel?: string;
}

export function Hero({ runtimeLabel = 'Next.js Demo' }: HeroProps) {
  const [showDebug, setShowDebug] = useState(false);
  const [showScrollbar, setShowScrollbar] = useState(true);

  return (
    <ImmersiveLanding
      activeHref="/"
      actionLinks={nextLandingActions}
      destinationCards={nextLandingDestinationCards}
      navigationLinks={nextDemoNavigationLinks}
      runtimeLabel={runtimeLabel}
      showDebug={showDebug}
      showScrollbar={showScrollbar}
      onToggleDebug={() => setShowDebug((value) => !value)}
      onToggleScrollbar={() => setShowScrollbar((value) => !value)}
      footer={
        <span>
          Run `pnpm dev:landing` to work on the shared landing source in the
          Next surface.
        </span>
      }
    />
  );
}
