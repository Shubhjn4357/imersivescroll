import type {
  FrameStoreState,
  ImmersiveFrameManifest,
  Subscriber,
  Unsubscribe
} from '@immersive-scroll/shared';
import { resolveFrameUrl } from './frameManifest';

export interface FrameStore {
  getState(): FrameStoreState;
  subscribe(listener: Subscriber<FrameStoreState>): Unsubscribe;
  setManifest(manifest: ImmersiveFrameManifest | null): void;
  setCurrentFrame(frameIndex: number): void;
  setLoadedFrames(frameIndexes: number[]): void;
  setError(error: Error | null): void;
  setReady(ready: boolean): void;
}

export function createFrameStore(): FrameStore {
  let state: FrameStoreState = {
    currentFrame: 0,
    totalFrames: 0,
    frameUrl: null,
    manifest: null,
    ready: false,
    error: null,
    loadedFrames: []
  };

  const listeners = new Set<Subscriber<FrameStoreState>>();
  const notify = () => listeners.forEach((listener) => listener(state));

  return {
    getState() {
      return state;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setManifest(manifest) {
      state = {
        ...state,
        manifest,
        totalFrames: manifest?.frameCount ?? 0,
        frameUrl: manifest
          ? resolveFrameUrl(manifest, state.currentFrame)
          : null,
        ready: Boolean(manifest)
      };
      notify();
    },
    setCurrentFrame(frameIndex) {
      state = {
        ...state,
        currentFrame: frameIndex,
        frameUrl: state.manifest
          ? resolveFrameUrl(state.manifest, frameIndex)
          : null
      };
      notify();
    },
    setLoadedFrames(frameIndexes) {
      state = {
        ...state,
        loadedFrames: [...new Set(frameIndexes)].sort(
          (left, right) => left - right
        )
      };
      notify();
    },
    setError(error) {
      state = { ...state, error };
      notify();
    },
    setReady(ready) {
      state = { ...state, ready };
      notify();
    }
  };
}
