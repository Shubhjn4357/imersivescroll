import type { ParentProps } from 'solid-js';
import { useImmersiveScroll } from '../hooks/useImmersiveScroll';

export function ImmersiveFloating(props: ParentProps) {
  const scroll = useImmersiveScroll();
  return <div style={{ transform: `translate3d(0, ${Math.min(scroll().velocity * 4, 32)}px, 0)` }}>{props.children}</div>;
}
