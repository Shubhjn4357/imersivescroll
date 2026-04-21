import { lerp, resolveSmoothingAmount } from '@immersive-scroll/shared';
import type { ScrollConfig } from '@immersive-scroll/shared';
import { normalizeProgress, segmentProgress } from './progressMath';

export function createProgressController() {
  let currentProgress = 0;
  let targetProgress = 0;

  return {
    getProgress() {
      return currentProgress;
    },
    getTargetProgress() {
      return targetProgress;
    },
    setProgress(nextProgress: number, immediate = false) {
      targetProgress = normalizeProgress(nextProgress);
      if (immediate) {
        currentProgress = targetProgress;
      }
      return targetProgress;
    },
    step(deltaTimeMs: number, config: ScrollConfig) {
      const progressGap = targetProgress - currentProgress;

      if (!config.smooth || Math.abs(progressGap) < 0.0001) {
        currentProgress = targetProgress;
        return currentProgress;
      }

      currentProgress = lerp(
        currentProgress,
        targetProgress,
        resolveSmoothingAmount(
          deltaTimeMs,
          config.lerp,
          config.duration,
          config.spring,
          progressGap
        )
      );

      return currentProgress;
    },
    getSegmentProgress(start: number, end: number) {
      return segmentProgress(currentProgress, start, end);
    }
  };
}
