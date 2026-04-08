import { clamp } from '@immersive-scroll/core';
import { useImmersiveContext } from './useImmersiveContext';

export function useImmersiveScrollbar() {
  const { config, scroll, containerRef } = useImmersiveContext();

  const scrollToProgress = (
    nextProgress: number,
    behavior: ScrollBehavior = 'auto'
  ) => {
    const containerElement = containerRef.current;
    if (!containerElement) {
      return;
    }

    const containerRect = containerElement.getBoundingClientRect();
    const containerTop = window.scrollY + containerRect.top;
    const scrollRange = Math.max(containerRect.height - window.innerHeight, 0);
    const normalizedProgress = clamp(nextProgress, 0, 1);
    const nextScrollTop = containerTop + scrollRange * normalizedProgress;

    window.scrollTo({
      top: nextScrollTop,
      behavior
    });
  };

  return {
    enabled: config.scrollbar.enabled,
    progress: scroll.progress,
    isScrolling: scroll.isScrolling,
    autoHide: config.scrollbar.autoHide,
    visibilityMode: config.scrollbar.visibilityMode,
    interactive: config.scrollbar.interactive,
    position: config.scrollbar.position,
    positionMode: config.scrollbar.positionMode,
    width: config.scrollbar.width,
    radius: config.scrollbar.radius,
    offset: config.scrollbar.offset,
    top: config.scrollbar.top,
    right: config.scrollbar.right,
    bottom: config.scrollbar.bottom,
    left: config.scrollbar.left,
    minThumbSize: config.scrollbar.minThumbSize,
    trackOpacity: config.scrollbar.trackOpacity,
    thumbOpacity: config.scrollbar.thumbOpacity,
    trackColor: config.scrollbar.trackColor,
    thumbColor: config.scrollbar.thumbColor,
    transitionDuration: config.scrollbar.transitionDuration,
    zIndex: config.scrollbar.zIndex,
    scrollToProgress
  };
}
