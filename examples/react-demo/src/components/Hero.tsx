import { useImmersiveConfigControls } from 'immersive-scroll';
import { ImmersiveLanding } from '../../../shared/react/ImmersiveLanding';

export function Hero() {
  const sceneControls = useImmersiveConfigControls({
    initialConfig: {
      debug: { enabled: false },
      scrollbar: {
        enabled: true,
        positionMode: 'absolute'
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
      runtimeLabel="React Demo"
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
    />
  );
}
