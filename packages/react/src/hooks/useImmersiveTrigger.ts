import { useRef } from 'react';
import {
  getTriggerActivation,
  type TriggerActivationState
} from '@immersive-scroll/core';
import { useImmersiveContext } from './useImmersiveContext';

export function useImmersiveTrigger(
  start = 0,
  end = 1
): TriggerActivationState {
  const { scroll } = useImmersiveContext();
  const previousProgressRef = useRef(scroll.progress);

  const activation = getTriggerActivation(
    scroll.progress,
    previousProgressRef.current,
    start,
    end
  );
  previousProgressRef.current = scroll.progress;

  return activation;
}
