import type { GsapRuntime } from './registerGsapPlugins';

type ScrollTriggerOptions = Parameters<
  GsapRuntime['ScrollTrigger']['create']
>[0];

export function setupScrollTrigger(
  ScrollTrigger: GsapRuntime['ScrollTrigger'],
  options: ScrollTriggerOptions
) {
  return ScrollTrigger.create(options);
}
