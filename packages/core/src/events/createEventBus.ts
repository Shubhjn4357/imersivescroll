import type { ImmersiveEventMap, Subscriber, Unsubscribe } from '@immersive-scroll/shared';

/** Create a typed event bus for engine lifecycle events. */
export function createEventBus() {
  const handlers = new Map<keyof ImmersiveEventMap, Set<Subscriber<unknown>>>();

  return {
    emit<TKey extends keyof ImmersiveEventMap>(type: TKey, payload: ImmersiveEventMap[TKey]) {
      handlers.get(type)?.forEach((handler) => {
        (handler as Subscriber<ImmersiveEventMap[TKey]>)(payload);
      });
    },
    on<TKey extends keyof ImmersiveEventMap>(
      type: TKey,
      handler: Subscriber<ImmersiveEventMap[TKey]>
    ): Unsubscribe {
      const bucket = handlers.get(type) ?? new Set<Subscriber<unknown>>();
      bucket.add(handler as Subscriber<unknown>);
      handlers.set(type, bucket);
      return () => bucket.delete(handler as Subscriber<unknown>);
    },
    clear() {
      handlers.clear();
    }
  };
}
