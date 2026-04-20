import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ImmersiveSvgMaskProps {
  /** The bottom layer content (static background) */
  background: React.ReactNode;
  /** The top layer content (masked foreground) */
  foreground: React.ReactNode;
  /** The duration of the scroll effect in pixels. Defaults to 2000. */
  scrollDistance?: number;
  /** CSS class for the container */
  className?: string;
  /** CSS styles for the container */
  style?: React.CSSProperties;
  /** Whether to pin the section during the mask expansion. Defaults to true. */
  pin?: boolean;
  /** The shape variant of the reveal mask. Defaults to 'pill'. */
  variant?: 'pill' | 'circle' | 'rect' | 'custom';
  /** A custom SVG path data string (d attribute) used when variant is 'custom'. */
  maskPath?: string;
  /** Edge softness (blur) in pixels. Defaults to 0. */
  softness?: number;
  /** Parallax intensity for foreground content (0..1). Defaults to 0.15. */
  parallax?: number;
}

/**
 * A high-end, scroll-driven SVG mask component inspired by the Lightship RV site.
 * It reveals a foreground layer over a background layer as the user scrolls.
 */
export function ImmersiveSvgMask({
  background,
  foreground,
  scrollDistance = 2000,
  className,
  style,
  pin = true,
  variant = 'pill',
  maskPath,
  softness = 0,
  parallax = 0.15
}: ImmersiveSvgMaskProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskShapeRef = useRef<SVGRectElement>(null);
  const maskPathRef = useRef<SVGPathElement>(null);
  const foregroundContentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current || !foregroundContentRef.current) return;

    // Determine target element for animation
    const target =
      variant === 'custom' ? maskPathRef.current : maskShapeRef.current;
    if (!target) return;

    // 1. Initialize Mask State
    if (variant === 'custom') {
      gsap.set(target, {
        scale: 0,
        opacity: 0,
        transformOrigin: 'center',
        transformBox: 'fill-box'
      });
    } else {
      const initialRx = variant === 'rect' ? 0 : 999;
      gsap.set(target, {
        attr: {
          x: '50%',
          y: '50%',
          width: '0%',
          height: '0%',
          rx: initialRx
        }
      });
    }

    const ctx = gsap.context(() => {
      // 2. Main Expansion Animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${scrollDistance}`,
          scrub: true,
          pin: pin,
          invalidateOnRefresh: true
        }
      });

      if (variant === 'custom') {
        tl.to(
          target,
          {
            scale: 40, // Large enough to cover screen
            opacity: 1,
            ease: 'none'
          },
          0
        );
      } else {
        tl.to(
          target,
          {
            attr: {
              x: '0%',
              y: '0%',
              width: '100%',
              height: '100%',
              rx: 0
            },
            ease: 'none'
          },
          0
        );
      }

      // 3. Foreground Parallax Effect
      tl.fromTo(
        foregroundContentRef.current,
        {
          y: `${parallax * 100}px`
        },
        {
          y: `-${parallax * 100}px`,
          ease: 'none'
        },
        0
      );

      // 4. Subtle "Wobble"
      gsap.to(target, {
        rotation: variant === 'custom' ? 2 : 0.5,
        scale: variant === 'custom' ? 1.05 : 1.01,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }, containerRef);

    return () => ctx.revert();
  }, [scrollDistance, pin, variant, parallax, maskPath]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        overflow: 'hidden',
        backgroundColor: '#000',
        ...style
      }}
    >
      {/* Background Layer (Static) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0
        }}
      >
        {background}
      </div>

      {/* Foreground Layer (Masked via SVG maskImage) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          WebkitMaskImage: 'url(#immersive-reveal-mask)',
          maskImage: 'url(#immersive-reveal-mask)',
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
          pointerEvents: 'none'
        }}
      >
        <div
          ref={foregroundContentRef}
          style={{
            width: '100%',
            height: '100%',
            pointerEvents: 'auto',
            willChange: 'transform'
          }}
        >
          {foreground}
        </div>
      </div>

      {/* Defs for the Mask */}
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: -1
        }}
        aria-hidden="true"
      >
        <defs>
          {softness > 0 && (
            <filter id="mask-blur">
              <feGaussianBlur in="SourceGraphic" stdDeviation={softness} />
            </filter>
          )}
          <mask id="immersive-reveal-mask">
            {variant === 'custom' && maskPath ? (
              <path
                ref={maskPathRef}
                d={maskPath}
                fill="white"
                style={{
                  filter: softness > 0 ? 'url(#mask-blur)' : 'none'
                }}
              />
            ) : (
              <rect
                ref={maskShapeRef}
                x="50%"
                y="50%"
                width="0%"
                height="0%"
                rx="20"
                fill="white"
                style={{
                  vectorEffect: 'non-scaling-stroke',
                  filter: softness > 0 ? 'url(#mask-blur)' : 'none',
                  transformOrigin: '50% 50%'
                }}
              />
            )}
          </mask>
        </defs>
      </svg>
    </div>
  );
}
