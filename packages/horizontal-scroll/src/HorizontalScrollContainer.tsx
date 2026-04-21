import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface HorizontalScrollContainerProps {
  children: React.ReactNode;
  /** Custom CSS class for the outermost container */
  className?: string;
  /** Custom CSS class for the horizontal moving track */
  trackClassName?: string;
  /** Distance to scroll (e.g., 'bottom top', 'top top') */
  start?: string | number;
  /** Scrub value (true, or a number for delay) */
  scrub?: boolean | number;
  /** Whether to pin the container while scrolling */
  pin?: boolean;
}

/**
 * A container that pins itself and translates its children horizontally
 * based on vertical scroll progress.
 */
export function HorizontalScrollContainer({
  children,
  className = '',
  trackClassName = '',
  start = 'top top',
  scrub = 1,
  pin = true
}: HorizontalScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current || !trackRef.current) return;

      const track = trackRef.current;
      const container = containerRef.current;

      const getScrollAmount = () => {
        const trackWidth = track.scrollWidth;
        const containerWidth = container.offsetWidth;
        return -(trackWidth - containerWidth);
      };

      gsap.to(track, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start,
          end: () => `+=${Math.abs(getScrollAmount())}`,
          pin,
          scrub,
          invalidateOnRefresh: true
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [pin, scrub, start]);

  return (
    <section
      ref={containerRef}
      className={`immersive-horizontal-container ${className}`}
      style={{
        overflow: 'hidden',
        width: '100%',
        position: 'relative'
      }}
    >
      <div
        ref={trackRef}
        className={`immersive-horizontal-track ${trackClassName}`}
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: 'max-content',
          willChange: 'transform'
        }}
      >
        {children}
      </div>
    </section>
  );
}
