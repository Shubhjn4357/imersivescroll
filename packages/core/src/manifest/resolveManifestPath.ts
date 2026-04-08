import type { ImmersiveConfig } from '@immersive-scroll/shared';

export function resolveManifestPath(config: ImmersiveConfig): string | null {
  if (config.manifestPath) {
    return config.manifestPath;
  }

  return config.framesPath
    ? `${config.framesPath.replace(/\/$/, '')}/manifest.json`
    : null;
}
