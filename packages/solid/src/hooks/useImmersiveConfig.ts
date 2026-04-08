import { useSolidImmersiveContext } from '../context/ImmersiveContext';

export function useImmersiveConfig() {
  return useSolidImmersiveContext().config;
}
