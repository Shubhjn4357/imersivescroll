import { createContext } from 'react';
import type { ImmersiveContextValue } from '../types/component-props';

export const ImmersiveContext = createContext<ImmersiveContextValue | null>(
  null
);
