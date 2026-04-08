# Quick Start: Solid

```tsx
import { ImmersiveScroll } from 'immersive-scroll/solid';

export function Hero() {
  return (
    <ImmersiveScroll framesPath="/immersive/ocean">Solid story</ImmersiveScroll>
  );
}
```

The Solid adapter keeps the frame pipeline in `core` and only binds state into Solid signals.
