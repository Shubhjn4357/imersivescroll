import { clamp } from './clamp';
import type { ScrollSpringConfig } from '../types/config';

const DEFAULT_DELTA_TIME_MS = 16;

/**
 * Resolve the amount to smooth (lerp) based on delta time,
 * target duration, and optional spring physics.
 */
export function resolveSmoothingAmount(
  deltaTimeMs: number,
  lerpAmount: number,
  durationSeconds: number,
  spring: ScrollSpringConfig,
  gap: number
) {
  const normalizedLerp = clamp(lerpAmount, 0.01, 1);
  const normalizedDuration = Math.max(durationSeconds, 0.001);

  // Exponential smoothing calculation
  // We normalize to a reference frame rate (60fps / 16.6ms)
  const frameRateAdjustedAmount =
    1 - Math.pow(1 - normalizedLerp, deltaTimeMs / DEFAULT_DELTA_TIME_MS);

  // Duration-based linear smoothing fallback
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

  // Add a spring-like boost for larger gaps if spring is enabled
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
