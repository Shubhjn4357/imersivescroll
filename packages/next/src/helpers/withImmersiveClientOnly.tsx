'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

export function withImmersiveClientOnly<TProps>(Component: ComponentType<TProps>) {
  return dynamic<TProps>(async () => ({ default: Component }), { ssr: false });
}
