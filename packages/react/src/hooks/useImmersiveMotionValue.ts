import { type MotionValue, motionValue } from 'framer-motion';
import { useImmersiveContext } from './useImmersiveContext';
import { useEffect, useState } from 'react';

export function useImmersiveMotionValue(): MotionValue<number> {
  const { engine } = useImmersiveContext();
  const [progressValue] = useState(() => motionValue(0));

  useEffect(() => {
    if (!engine) return;

    // Set initial value
    progressValue.set(engine.getState().scroll.progress);

    // Subscribe to engine's scroll events
    const unsubscribe = engine.subscribeScroll((scrollState) => {
      progressValue.set(scrollState.progress);
    });

    return () => {
      unsubscribe();
    };
  }, [engine, progressValue]);

  return progressValue;
}
