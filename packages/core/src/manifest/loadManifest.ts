import { validateFrameManifest } from '@immersive-scroll/shared';
import type { ImmersiveFrameManifest } from '@immersive-scroll/shared';

/** Load a manifest from a URL in client runtime. */
export async function loadManifest(
  manifestPath: string
): Promise<ImmersiveFrameManifest> {
  const response = await fetch(manifestPath);
  if (!response.ok) {
    throw new Error(
      `Failed to load manifest: ${response.status} ${response.statusText}`
    );
  }

  const payload = (await response.json()) as unknown;
  const validation = validateFrameManifest(payload);
  if (!validation.valid || !validation.data) {
    throw new Error('Manifest is invalid.');
  }

  return validation.data;
}
