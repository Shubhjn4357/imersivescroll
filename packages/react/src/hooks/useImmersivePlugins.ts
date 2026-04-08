import type { ImmersivePlugin } from '@immersive-scroll/core';
import { useImmersiveContext } from './useImmersiveContext';

export function useImmersivePlugins() {
  const { plugins } = useImmersiveContext();

  return {
    plugins,
    registerPlugin(plugin: ImmersivePlugin) {
      void plugin;
    },
    unregisterPlugin(name: string) {
      void name;
    }
  };
}
