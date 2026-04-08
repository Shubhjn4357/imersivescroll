import { useImmersiveContext } from './useImmersiveContext';

export function useImmersiveScroll() {
  const { scroll, engine } = useImmersiveContext();

  return {
    progress: scroll.progress,
    direction: scroll.direction,
    velocity: scroll.velocity,
    scrollY: scroll.scrollY,
    isScrolling: scroll.isScrolling,
    scrollTo(target: number) {
      window.scrollTo({ top: target, behavior: 'smooth' });
      engine?.updateScroll(target);
    },
    pauseScroll() {
      engine?.pause();
    },
    resumeScroll() {
      engine?.resume();
    },
    setScrollOptions() {}
  };
}
