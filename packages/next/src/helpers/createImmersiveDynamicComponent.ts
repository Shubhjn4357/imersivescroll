import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

export function createImmersiveDynamicComponent<TProps>(
  loader: () => Promise<{ default: ComponentType<TProps> }>
) {
  return dynamic(loader, { ssr: false });
}
