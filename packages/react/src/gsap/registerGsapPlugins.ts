import type gsapModule from 'gsap';
import type {
  ScrollTrigger as ScrollTriggerClass
} from 'gsap/ScrollTrigger';

type GsapInstance = typeof gsapModule;
type ScrollTriggerStatic = typeof ScrollTriggerClass;

export interface GsapRuntime {
  gsap: GsapInstance;
  ScrollTrigger: ScrollTriggerStatic;
}

let runtimePromise: Promise<GsapRuntime | null> | null = null;

export async function registerGsapPlugins(): Promise<GsapRuntime | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!runtimePromise) {
    runtimePromise = Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      .then(([gsapModule, scrollTriggerModule]) => {
        const gsap = gsapModule.default;
        const ScrollTrigger = scrollTriggerModule.ScrollTrigger;

        gsap.registerPlugin(ScrollTrigger);

        return {
          gsap,
          ScrollTrigger
        };
      })
      .catch(() => null);
  }

  return runtimePromise;
}
