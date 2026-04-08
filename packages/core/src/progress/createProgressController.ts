import { normalizeProgress, segmentProgress } from './progressMath';

export function createProgressController() {
  let progress = 0;

  return {
    getProgress() {
      return progress;
    },
    setProgress(nextProgress: number) {
      progress = normalizeProgress(nextProgress);
      return progress;
    },
    getSegmentProgress(start: number, end: number) {
      return segmentProgress(progress, start, end);
    }
  };
}
