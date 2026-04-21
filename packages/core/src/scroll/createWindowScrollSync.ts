import { clamp, type ScrollConfig } from '@immersive-scroll/shared';

export interface WindowScrollSyncCallbacks {
  updateProgress: (progress: number) => void | Promise<void>;
  updateScroll: (scrollY: number, velocity: number) => void;
  endScroll: (scrollY: number) => void;
}

export interface CreateWindowScrollSyncOptions {
  callbacks: WindowScrollSyncCallbacks;
  resolveProgress: (scrollY: number) => number;
  getScrollConfig: () => Pick<
    ScrollConfig,
    'enabled' | 'smooth' | 'lerp' | 'duration' | 'spring'
  >;
  getScrollY?: () => number;
  now?: () => number;
  idleTimeoutMs?: number;
  scrollTarget?: EventTarget;
}

const DEFAULT_IDLE_TIMEOUT_MS = 96;
const DEFAULT_DELTA_TIME_MS = 16;
const MIN_VELOCITY = 0.0005;

export function createWindowScrollSync({
  callbacks,
  resolveProgress,
  getScrollConfig,
  getScrollY = () => window.scrollY,
  now = () => performance.now(),
  idleTimeoutMs = DEFAULT_IDLE_TIMEOUT_MS,
  scrollTarget
}: CreateWindowScrollSyncOptions) {
  let scrollIdleTimeout = 0;
  let destroyed = false;
  let lastScrollY = getScrollY();
  let lastTimestamp = now();

  const scheduleScrollIdle = () => {
    window.clearTimeout(scrollIdleTimeout);
    scrollIdleTimeout = window.setTimeout(() => {
      callbacks.endScroll(getScrollY());
    }, idleTimeoutMs);
  };

  const handleScrollChange = () => {
    if (destroyed) return;

    const currentScrollY = getScrollY();
    const currentTimestamp = now();
    const deltaTime = Math.max(
      currentTimestamp - lastTimestamp,
      DEFAULT_DELTA_TIME_MS
    );

    const rawVelocity = (currentScrollY - lastScrollY) / deltaTime;
    const scrollConfig = getScrollConfig();

    lastScrollY = currentScrollY;
    lastTimestamp = currentTimestamp;

    if (scrollConfig.enabled) {
      const targetProgress = clamp(resolveProgress(currentScrollY), 0, 1);
      void callbacks.updateProgress(targetProgress);
    }

    const effectiveVelocity =
      Math.abs(rawVelocity) > MIN_VELOCITY ? rawVelocity : 0;
    callbacks.updateScroll(currentScrollY, effectiveVelocity);
    scheduleScrollIdle();
  };

  const syncNow = () => {
    const scrollY = getScrollY();
    lastScrollY = scrollY;
    lastTimestamp = now();

    if (getScrollConfig().enabled) {
      const targetProgress = clamp(resolveProgress(scrollY), 0, 1);
      void callbacks.updateProgress(targetProgress);
    }

    callbacks.updateScroll(scrollY, 0);
    scheduleScrollIdle();
  };

  const target = scrollTarget ?? window;

  target.addEventListener('scroll', handleScrollChange, { passive: true });
  target.addEventListener('resize', handleScrollChange);

  return {
    syncNow,
    destroy() {
      destroyed = true;
      target.removeEventListener('scroll', handleScrollChange);
      target.removeEventListener('resize', handleScrollChange);
      window.clearTimeout(scrollIdleTimeout);
    }
  };
}
