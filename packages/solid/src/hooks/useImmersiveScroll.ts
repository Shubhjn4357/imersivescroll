import { useSolidImmersiveContext } from '../context/ImmersiveContext';

export function useImmersiveScroll() {
  return useSolidImmersiveContext().scroll;
}
