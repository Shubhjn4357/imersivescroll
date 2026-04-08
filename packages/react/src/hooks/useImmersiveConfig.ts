import { useImmersiveContext } from './useImmersiveContext';

export function useImmersiveConfig() {
  return useImmersiveContext().config;
}
