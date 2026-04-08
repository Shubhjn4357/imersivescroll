'use client';

import type { RefObject } from 'react';
import {
  createGsapTimeline,
  setupScrollTrigger,
  useScrollTriggerSetup
} from '../../../packages/react/src';

interface UseMarketingMotionOptions {
  disabled?: boolean;
}

export function useMarketingMotion(
  scopeRef: RefObject<HTMLElement | null>,
  options: UseMarketingMotionOptions = {}
) {
  useScrollTriggerSetup({
    scopeRef,
    ...(options.disabled !== undefined ? { disabled: options.disabled } : {}),
    setup: ({ gsap, ScrollTrigger, scope }) => {
      const select = gsap.utils.selector(scope);
      const introTargets = select('[data-reveal="intro"]');
      const cardTargets = select('[data-reveal="card"]');
      const floatTargets = select('[data-reveal="float"]');

      if (introTargets.length > 0) {
        const introTimeline = createGsapTimeline(gsap, {
          defaults: {
            duration: 0.78,
            ease: 'power3.out'
          }
        });

        introTimeline.fromTo(
          introTargets,
          {
            opacity: 0,
            y: 28,
            filter: 'blur(8px)'
          },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            stagger: 0.1,
            clearProps: 'filter'
          }
        );
      }

      cardTargets.forEach((target, index) => {
        if (!(target instanceof HTMLElement)) {
          return;
        }

        const trigger =
          target.closest<HTMLElement>('[data-trigger="section"]') ?? target;
        const horizontalOffset =
          target.dataset.align === 'right'
            ? 40
            : target.dataset.align === 'left'
              ? -40
              : index % 2 === 0
                ? -28
                : 28;
        const animation = gsap.fromTo(
          target,
          {
            opacity: 0,
            y: 36,
            x: horizontalOffset,
            scale: 0.985,
            filter: 'blur(8px)'
          },
          {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.82,
            ease: 'power3.out',
            clearProps: 'filter'
          }
        );

        setupScrollTrigger(ScrollTrigger, {
          trigger,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
          animation
        });
      });

      floatTargets.forEach((target, index) => {
        if (!(target instanceof HTMLElement)) {
          return;
        }

        const axisShift = index % 2 === 0 ? -18 : 18;
        const animation = gsap.to(target, {
          yPercent: axisShift,
          xPercent: index % 3 === 0 ? 10 : -10,
          rotate: index % 2 === 0 ? -4 : 4,
          ease: 'none'
        });

        setupScrollTrigger(ScrollTrigger, {
          trigger: scope,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
          animation
        });
      });
    }
  });
}
