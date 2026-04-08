import type { DependencyList, RefObject } from 'react';
import { registerGsapPlugins, type GsapRuntime } from '../gsap/registerGsapPlugins';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
import { useRef } from 'react';

type GsapContext = ReturnType<GsapRuntime['gsap']['context']>;

export interface ScrollTriggerSetupContext extends GsapRuntime {
  scope: HTMLElement;
}

export interface UseScrollTriggerSetupOptions {
  scopeRef: RefObject<HTMLElement | null>;
  dependencies?: DependencyList;
  disabled?: boolean;
  setup: (context: ScrollTriggerSetupContext) => void | (() => void);
}

export function useScrollTriggerSetup({
  scopeRef,
  dependencies = [],
  disabled = false,
  setup
}: UseScrollTriggerSetupOptions) {
  const setupRef = useRef(setup);
  setupRef.current = setup;

  useIsomorphicLayoutEffect(() => {
    if (disabled) {
      return;
    }

    let disposed = false;
    let cleanup: void | (() => void);
    let context: GsapContext | null = null;

    void registerGsapPlugins().then((runtime) => {
      if (!runtime || disposed) {
        return;
      }

      const scope = scopeRef.current;
      if (!scope) {
        return;
      }

      context = runtime.gsap.context(() => {
        cleanup = setupRef.current({
          ...runtime,
          scope
        });
      }, scope);

      runtime.ScrollTrigger.refresh();
    });

    return () => {
      disposed = true;
      cleanup?.();
      context?.revert();
    };
  }, [disabled, scopeRef, ...dependencies]);
}
