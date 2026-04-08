import type { ImmersivePlugin, ImmersivePluginContext } from '@immersive-scroll/shared';

export function createPluginManager(initialPlugins: ImmersivePlugin[], context: ImmersivePluginContext) {
  const plugins = new Map(initialPlugins.map((plugin) => [plugin.name, plugin]));

  return {
    getPlugins() {
      return Array.from(plugins.values());
    },
    registerPlugin(plugin: ImmersivePlugin) {
      plugins.set(plugin.name, plugin);
    },
    unregisterPlugin(name: string) {
      plugins.delete(name);
    },
    async setup() {
      await Promise.all(Array.from(plugins.values()).map((plugin) => plugin.setup?.(context)));
    },
    async onReady() {
      await Promise.all(Array.from(plugins.values()).map((plugin) => plugin.onReady?.(context)));
    },
    async onFrameChange(frameIndex: number) {
      await Promise.all(Array.from(plugins.values()).map((plugin) => plugin.onFrameChange?.(context, frameIndex)));
    },
    async onScroll() {
      const scrollState = context.scrollStore.getState();
      await Promise.all(Array.from(plugins.values()).map((plugin) => plugin.onScroll?.(context, scrollState)));
    },
    async onResize() {
      await Promise.all(Array.from(plugins.values()).map((plugin) => plugin.onResize?.(context)));
    },
    async onDestroy() {
      await Promise.all(Array.from(plugins.values()).map((plugin) => plugin.onDestroy?.(context)));
    }
  };
}
