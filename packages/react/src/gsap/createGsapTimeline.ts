import type { GsapRuntime } from './registerGsapPlugins';

type TimelineOptions = Parameters<GsapRuntime['gsap']['timeline']>[0];

export function createGsapTimeline(
  gsap: GsapRuntime['gsap'],
  options?: TimelineOptions
) {
  return gsap.timeline(options);
}
