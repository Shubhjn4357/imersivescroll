import type { Subscriber, Unsubscribe } from '@immersive-scroll/shared';
import {
  createViewportObserver,
  type ViewportSnapshot
} from '../viewport/createViewportObserver';

export function createResizeController(container: HTMLElement | null) {
  const observer = createViewportObserver(container);
  const listeners = new Set<Subscriber<ViewportSnapshot>>();

  const unsubscribe = observer.subscribe((snapshot) => {
    listeners.forEach((listener) => listener(snapshot));
  });

  return {
    getSnapshot: observer.getSnapshot,
    subscribe(listener: Subscriber<ViewportSnapshot>): Unsubscribe {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    disconnect() {
      unsubscribe();
      observer.disconnect();
      listeners.clear();
    }
  };
}
