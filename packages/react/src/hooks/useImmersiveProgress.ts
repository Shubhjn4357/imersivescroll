import { segmentProgress } from '@immersive-scroll/core';
import { useImmersiveContext } from './useImmersiveContext';

export function useImmersiveProgress(start = 0, end = 1) {
  const { scroll } = useImmersiveContext();

  return {
    progress: scroll.progress,
    segmentProgress: segmentProgress(scroll.progress, start, end)
  };
}
