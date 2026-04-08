import { ImmersiveLanding } from '../../../shared/react/ImmersiveLanding';

interface HeroProps {
  debug: boolean;
  showScrollbar: boolean;
  onToggleDebug: () => void;
  onToggleScrollbar: () => void;
}

export function Hero({
  debug,
  showScrollbar,
  onToggleDebug,
  onToggleScrollbar
}: HeroProps) {
  return (
    <ImmersiveLanding
      runtimeLabel="React Demo"
      showDebug={debug}
      showScrollbar={showScrollbar}
      onToggleDebug={onToggleDebug}
      onToggleScrollbar={onToggleScrollbar}
    />
  );
}
