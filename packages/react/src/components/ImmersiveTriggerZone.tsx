import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { useImmersiveTrigger } from '../hooks/useImmersiveTrigger';

interface ImmersiveTriggerZoneProps extends PropsWithChildren {
  start: number;
  end: number;
  onEnter?: () => void;
  onLeave?: () => void;
}

export function ImmersiveTriggerZone({ children, start, end, onEnter, onLeave }: ImmersiveTriggerZoneProps) {
  const trigger = useImmersiveTrigger(start, end);

  useEffect(() => {
    if (trigger.entered) {
      onEnter?.();
    }
    if (trigger.left) {
      onLeave?.();
    }
  }, [onEnter, onLeave, trigger.entered, trigger.left]);

  return <div data-immersive-active={trigger.active}>{children}</div>;
}
