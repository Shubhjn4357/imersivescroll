import { forwardRef } from 'react';
import type { CanvasHTMLAttributes } from 'react';

export const ImmersiveCanvas = forwardRef<HTMLCanvasElement, CanvasHTMLAttributes<HTMLCanvasElement>>(
  function ImmersiveCanvas(props, ref) {
    return <canvas {...props} ref={ref} aria-hidden="true" />;
  }
);
