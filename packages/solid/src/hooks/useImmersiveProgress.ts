import { segmentProgress } from '@immersive-scroll/core';
import { useSolidImmersiveContext } from '../context/ImmersiveContext';

export function useImmersiveProgress(start = 0, end = 1) {
  const scroll = useSolidImmersiveContext().scroll;

  return () => ({
    progress: scroll().progress,
    segmentProgress: segmentProgress(scroll().progress, start, end)
  });
}
