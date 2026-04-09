import {
  clamp,
  lerp,
  type ScrollConfig,
  type ScrollSpringConfig
} from '@immersive-scroll/shared';

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
}

const DEFAULT_IDLE_TIMEOUT_MS = 96;
const DEFAULT_DELTA_TIME_MS = 16;
const MIN_PROGRESS_DELTA = 0.0005;
const MIN_VELOCITY = 0.0005;

function resolveSmoothingAmount(
  deltaTimeMs: number,
  lerpAmount: number,
  durationSeconds: number,
  spring: ScrollSpringConfig,
  gap: number
) {
  const normalizedLerp = clamp(lerpAmount, 0.01, 1);
  const normalizedDuration = Math.max(durationSeconds, 0.001);
  const frameRateAdjustedAmount =
    1 - Math.pow(1 - normalizedLerp, deltaTimeMs / DEFAULT_DELTA_TIME_MS);
  const durationAdjustedAmount = clamp(
    deltaTimeMs / (normalizedDuration * 1000),
    0.01,
    1
  );

  if (!spring.enabled) {
    return clamp(
      Math.max(frameRateAdjustedAmount, durationAdjustedAmount),
      0.01,
      1
    );
  }

  const springBoost = clamp(
    (Math.abs(gap) * spring.stiffness) / Math.max(spring.damping * 24, 1),
    0,
    0.28
  );

  return clamp(
    Math.max(frameRateAdjustedAmount, durationAdjustedAmount) + springBoost,
    0.01,
    1
  );
}

export function createWindowScrollSync({
  callbacks,
  resolveProgress,
  getScrollConfig,
  getScrollY = () => window.scrollY,
  now = () => performance.now(),
  idleTimeoutMs = DEFAULT_IDLE_TIMEOUT_MS
}: CreateWindowScrollSyncOptions) {
  let animationFrameId = 0;
  let scrollIdleTimeout = 0;
  let destroyed = false;
  let lastScrollY = getScrollY();
  let lastTimestamp = now();
  let currentProgress = clamp(resolveProgress(lastScrollY), 0, 1);
  let targetProgress = currentProgress;

  const scheduleScrollIdle = () => {
    window.clearTimeout(scrollIdleTimeout);
    scrollIdleTimeout = window.setTimeout(() => {
      callbacks.endScroll(getScrollY());
    }, idleTimeoutMs);
  };

  const requestTick = () => {
    if (destroyed || animationFrameId !== 0) {
      return;
    }

    animationFrameId = window.requestAnimationFrame(step);
  };

  function step(timestamp: number) {
    animationFrameId = 0;

    const currentScrollY = getScrollY();
    const currentTimestamp = timestamp || now();
    const deltaTime = Math.max(
      currentTimestamp - lastTimestamp,
      DEFAULT_DELTA_TIME_MS
    );
    const rawVelocity = (currentScrollY - lastScrollY) / deltaTime;
    const scrollConfig = getScrollConfig();

    lastScrollY = currentScrollY;
    lastTimestamp = currentTimestamp;
    targetProgress = clamp(resolveProgress(currentScrollY), 0, 1);

    const progressGap = targetProgress - currentProgress;
    const nextProgress = !scrollConfig.enabled
      ? currentProgress
      : !scrollConfig.smooth
        ? targetProgress
        : lerp(
            currentProgress,
            targetProgress,
            resolveSmoothingAmount(
              deltaTime,
              scrollConfig.lerp,
              scrollConfig.duration,
              scrollConfig.spring,
              progressGap
            )
          );

    const resolvedProgress =
      Math.abs(targetProgress - nextProgress) <=
      (scrollConfig.spring.enabled
        ? scrollConfig.spring.threshold
        : MIN_PROGRESS_DELTA)
        ? targetProgress
        : clamp(nextProgress, 0, 1);
    const progressDelta = resolvedProgress - currentProgress;
    const carryVelocity =
      Math.abs(progressDelta) > MIN_PROGRESS_DELTA
        ? Math.sign(progressDelta) * Math.min(Math.abs(progressDelta) * 8, 0.25)
        : 0;
    const effectiveVelocity =
      Math.abs(rawVelocity) > MIN_VELOCITY ? rawVelocity : carryVelocity;

    currentProgress = resolvedProgress;

    if (scrollConfig.enabled) {
      void callbacks.updateProgress(currentProgress);
    }

    callbacks.updateScroll(currentScrollY, effectiveVelocity);
    scheduleScrollIdle();

    if (
      scrollConfig.enabled &&
      (Math.abs(targetProgress - currentProgress) > MIN_PROGRESS_DELTA ||
        Math.abs(effectiveVelocity) > MIN_VELOCITY)
    ) {
      requestTick();
    }
  }

  const syncNow = () => {
    const scrollY = getScrollY();

    lastScrollY = scrollY;
    lastTimestamp = now();
    targetProgress = clamp(resolveProgress(scrollY), 0, 1);
    currentProgress = targetProgress;

    if (getScrollConfig().enabled) {
      void callbacks.updateProgress(currentProgress);
    }

    callbacks.updateScroll(scrollY, 0);
    scheduleScrollIdle();
  };

  const handleScrollChange = () => {
    targetProgress = clamp(resolveProgress(getScrollY()), 0, 1);
    requestTick();
  };

  window.addEventListener('scroll', handleScrollChange, { passive: true });
  window.addEventListener('resize', handleScrollChange);

  return {
    syncNow,
    destroy() {
      destroyed = true;
      window.removeEventListener('scroll', handleScrollChange);
      window.removeEventListener('resize', handleScrollChange);
      window.cancelAnimationFrame(animationFrameId);
      window.clearTimeout(scrollIdleTimeout);
    }
  };
}
