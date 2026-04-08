import { useSolidImmersiveContext } from '../context/ImmersiveContext';

export function useImmersiveFrame() {
  return useSolidImmersiveContext().frame;
}
