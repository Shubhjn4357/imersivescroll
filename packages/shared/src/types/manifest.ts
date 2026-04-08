export interface ImmersiveFrameManifest {
  version: string;
  videoHash: string;
  sourceVideo: string;
  frameCount: number;
  fps: number;
  width: number;
  height: number;
  format: 'webp' | 'png' | 'jpg';
  quality: number;
  framePattern: string;
  framePrefix: string;
  generatedAt: string;
  generator: string;
  configFingerprint: string;
  framesPath?: string | null;
}
