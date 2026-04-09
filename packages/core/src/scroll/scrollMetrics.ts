import { clamp } from '@immersive-scroll/shared';

export interface ImmersiveScrollMetrics {
  componentScrollRange: number;
  containerTop: number;
  globalScrollRange: number;
  usesGlobalRange: boolean;
}

function resolveViewportHeight() {
  return Math.max(window.innerHeight, 1);
}

export function getImmersiveScrollMetrics(
  containerElement: HTMLElement | null,
  scrollY = window.scrollY
): ImmersiveScrollMetrics {
  const viewportHeight = resolveViewportHeight();
  const containerRect = containerElement?.getBoundingClientRect();
  const containerTop = containerRect ? scrollY + containerRect.top : 0;
  const containerHeight =
    containerRect?.height ?? document.documentElement.scrollHeight;
  const componentScrollRange = Math.max(containerHeight - viewportHeight, 0);
  const globalScrollRange = Math.max(
    document.documentElement.scrollHeight - viewportHeight,
    1
  );

  return {
    componentScrollRange,
    containerTop,
    globalScrollRange,
    usesGlobalRange: componentScrollRange <= 1
  };
}

export function resolveProgressFromScrollY(
  scrollY: number,
  containerElement: HTMLElement | null
) {
  const metrics = getImmersiveScrollMetrics(containerElement, scrollY);

  if (metrics.usesGlobalRange) {
    return clamp(scrollY / metrics.globalScrollRange, 0, 1);
  }

  return clamp(
    (scrollY - metrics.containerTop) / metrics.componentScrollRange,
    0,
    1
  );
}

export function resolveScrollYFromProgress(
  progress: number,
  containerElement: HTMLElement | null
) {
  const normalizedProgress = clamp(progress, 0, 1);
  const metrics = getImmersiveScrollMetrics(containerElement);

  if (metrics.usesGlobalRange) {
    return metrics.globalScrollRange * normalizedProgress;
  }

  return (
    metrics.containerTop + metrics.componentScrollRange * normalizedProgress
  );
}
