import { useContext } from 'react';
import { ImmersiveContext } from '../context/ImmersiveContext';

export function useImmersiveContext() {
  const context = useContext(ImmersiveContext);

  if (!context) {
    throw new Error(
      'useImmersiveContext must be used within ImmersiveScrollProvider.'
    );
  }

  return context;
}
