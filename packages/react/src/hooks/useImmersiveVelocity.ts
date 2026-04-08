import { useImmersiveContext } from './useImmersiveContext';

export function useImmersiveVelocity() {
  return useImmersiveContext().scroll.velocity;
}
