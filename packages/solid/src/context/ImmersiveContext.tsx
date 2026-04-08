import { createContext, useContext } from 'solid-js';
import type { Accessor } from 'solid-js';
import type { FrameStoreState, ImmersiveConfig, ScrollState } from '@immersive-scroll/core';

export interface SolidImmersiveContextValue {
  config: Accessor<ImmersiveConfig>;
  frame: Accessor<FrameStoreState>;
  scroll: Accessor<ScrollState>;
}

const ImmersiveContext = createContext<SolidImmersiveContextValue>();

export function useSolidImmersiveContext() {
  const context = useContext(ImmersiveContext);
  if (!context) {
    throw new Error('Immersive context is missing.');
  }
  return context;
}

export { ImmersiveContext };
