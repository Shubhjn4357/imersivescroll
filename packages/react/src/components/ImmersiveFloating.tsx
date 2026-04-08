import type { PropsWithChildren } from 'react';
import { useImmersiveVelocity } from '../hooks/useImmersiveVelocity';

export function ImmersiveFloating({ children }: PropsWithChildren) {
  const velocity = useImmersiveVelocity();

  return (
    <div style={{ transform: `translate3d(0, ${Math.min(velocity * 4, 32)}px, 0)`, willChange: 'transform' }}>
      {children}
    </div>
  );
}
