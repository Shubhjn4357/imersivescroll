import type { JSX } from 'solid-js';

export function ImmersiveCanvas(props: JSX.CanvasHTMLAttributes<HTMLCanvasElement>) {
  return <canvas {...props} aria-hidden="true" />;
}
