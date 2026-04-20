'use client';

import { useImmersiveConfigControls } from 'immersive-scroll';
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
  const sceneControls = useImmersiveConfigControls({
    initialConfig: {
      debug: { enabled: false },
      scrollbar: {
        enabled: true,
        positionMode: 'fixed'
      }
    }
  });
  const showDebug = sceneControls.config.debug?.enabled ?? false;
  const showScrollbar = sceneControls.config.scrollbar?.enabled ?? true;
  const scrollbarPositionMode =
    sceneControls.config.scrollbar?.positionMode === 'fixed'
      ? 'fixed'
      : 'absolute';

  return (
    <ImmersiveLanding
      activeHref="/"
      actionLinks={nextLandingActions}
      destinationCards={nextLandingDestinationCards}
      navigationLinks={nextDemoNavigationLinks}
      runtimeLabel={runtimeLabel}
      showDebug={showDebug}
      showScrollbar={showScrollbar}
      scrollbarPositionMode={scrollbarPositionMode}
      onToggleDebug={() =>
        sceneControls.updateDebug({
          enabled: !showDebug
        })
      }
      onToggleScrollbar={() =>
        sceneControls.updateScrollbar({
          enabled: !showScrollbar
        })
      }
      onToggleScrollbarPositionMode={() =>
        sceneControls.updateScrollbar({
          positionMode:
            scrollbarPositionMode === 'absolute' ? 'fixed' : 'absolute'
        })
      }
      footer={<span>shared landing source in the Next surface.</span>}
    />
  );
}
