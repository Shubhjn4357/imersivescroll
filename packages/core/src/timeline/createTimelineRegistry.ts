import type { TimelineEntry } from '@immersive-scroll/shared';

export function createTimelineRegistry() {
  const registry = new Map<string, unknown>();

  return {
    registerTimeline<TValue>(id: string, value: TValue) {
      registry.set(id, value);
    },
    removeTimeline(id: string) {
      registry.delete(id);
    },
    getTimeline<TValue>(id: string): TValue | undefined {
      return registry.get(id) as TValue | undefined;
    },
    getAll(): TimelineEntry[] {
      return Array.from(registry.entries()).map(([id, value]) => ({
        id,
        value
      }));
    }
  };
}
