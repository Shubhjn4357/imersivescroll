import { useImmersiveContext } from './useImmersiveContext';

export function useImmersiveFrame() {
  const { frame } = useImmersiveContext();

  return {
    currentFrame: frame.currentFrame,
    totalFrames: frame.totalFrames,
    frameUrl: frame.frameUrl,
    manifest: frame.manifest,
    isReady: frame.ready,
    error: frame.error
  };
}
