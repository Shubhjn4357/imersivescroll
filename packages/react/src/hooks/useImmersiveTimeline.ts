import { useImmersiveContext } from './useImmersiveContext';

export function useImmersiveTimeline() {
  const { engine } = useImmersiveContext();
  const registry = engine?.getContext().timelineRegistry;

  return {
    registerTimeline<TValue>(id: string, value: TValue) {
      registry?.registerTimeline(id, value);
    },
    removeTimeline(id: string) {
      registry?.removeTimeline(id);
    },
    getTimeline<TValue>(id: string) {
      return registry?.getTimeline<TValue>(id);
    }
  };
}
