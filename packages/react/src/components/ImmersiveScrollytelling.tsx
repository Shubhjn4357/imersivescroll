import { motion, useTransform } from 'framer-motion';
import type { ReactNode } from 'react';
import { useImmersiveMotionValue } from '../hooks/useImmersiveMotionValue';
import { ImmersiveScroll } from './ImmersiveScroll';
import type { ImmersiveScrollProps } from '../types/component-props';

export interface ScrollytellingStep {
  /** The scroll progress start percentage (0 to 1) for this step */
  start: number;
  /** The scroll progress end percentage (0 to 1) for this step */
  end: number;
  /** Unique key for the step */
  id: string;
  /** Content to render for this sequence stage (e.g. text/copy) */
  content: ReactNode;
  /** Placement configuration to avoid overlapping with floating product parts */
  placement?: 'left' | 'right' | 'center';
}

export interface ImmersiveScrollytellingProps extends ImmersiveScrollProps {
  /** Array of sequence steps mapping a scroll range to specific UI elements */
  steps: ScrollytellingStep[];
}

const placementStyleMap = {
  left: { left: '10%', top: '40%', transform: 'translateY(-50%)' },
  right: { right: '10%', top: '40%', transform: 'translateY(-50%)' },
  center: { left: '50%', top: '80%', transform: 'translate(-50%, -50%)' }
};

/**
 * Creates a high-end Scrollytelling web experience.
 * This wraps `ImmersiveScroll` and overlays `steps` mapped to the 0-1 scroll map.
 *
 * Each text block is "synced" to the 3D animation using Framer Motion's `useTransform`
 * to perform Opacity Mapping. This natively recreates an "Apple-style" presentation
 * with unified `#050505` background and generous negative space.
 */
export function ImmersiveScrollytelling({
  steps,
  style,
  ...immersiveProps
}: ImmersiveScrollytellingProps) {
  return (
    <ImmersiveScroll
      {...immersiveProps}
      style={{
        background: '#050505', // Unified background for void effect
        ...style
      }}
      overlay={<ScrollytellingOverlay steps={steps} />}
    />
  );
}

function ScrollytellingOverlay({ steps }: { steps: ScrollytellingStep[] }) {
  const progress = useImmersiveMotionValue();

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 10
      }}
    >
      {steps.map((step) => {
        // Calculate a safe transition padding based on step duration
        const pad = Math.min((step.end - step.start) * 0.2, 0.05);

        // Opacity Mapping: fade in during the first `pad` of its active area,
        // stay solid, then fade out during the last `pad`.
        const opacity = useTransform(
          progress,
          [
            Math.max(0, step.start - pad),
            step.start,
            step.end,
            Math.min(1, step.end + pad)
          ],
          [0, 1, 1, 0]
        );

        // Subtle upward translate effect while active
        const y = useTransform(progress, [step.start, step.end], [20, -20]);

        const positionStyles = placementStyleMap[step.placement || 'center'];

        return (
          <motion.div
            key={step.id}
            style={{
              position: 'absolute',
              opacity,
              y,
              pointerEvents: 'auto',
              ...positionStyles
            }}
          >
            {step.content}
          </motion.div>
        );
      })}
    </div>
  );
}
