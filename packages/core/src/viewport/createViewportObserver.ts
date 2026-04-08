import type { Subscriber, Unsubscribe } from '@immersive-scroll/shared';

export interface ViewportSnapshot {
  width: number;
  height: number;
  pixelRatio: number;
}

function readViewport(container: HTMLElement | null): ViewportSnapshot {
  const width =
    container?.clientWidth ??
    (typeof window !== 'undefined' ? window.innerWidth : 1280);
  const height =
    container?.clientHeight ??
    (typeof window !== 'undefined' ? window.innerHeight : 720);
  const pixelRatio =
    typeof window !== 'undefined'
      ? Math.max(1, window.devicePixelRatio || 1)
      : 1;
  return { width, height, pixelRatio };
}

export function createViewportObserver(container: HTMLElement | null) {
  let snapshot = readViewport(container);
  const listeners = new Set<Subscriber<ViewportSnapshot>>();

  const handleResize = () => {
    snapshot = readViewport(container);
    listeners.forEach((listener) => listener(snapshot));
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('resize', handleResize);
  }

  return {
    getSnapshot() {
      return snapshot;
    },
    subscribe(listener: Subscriber<ViewportSnapshot>): Unsubscribe {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    disconnect() {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }

      listeners.clear();
    }
  };
}
