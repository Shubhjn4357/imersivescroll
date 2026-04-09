# Quick Start: Next.js

Use the Next adapter when the page should stay server-rendered but the immersive stage must mount only on the client.

```tsx
'use client';

import { NextImmersiveScroll } from 'immersive-scroll/next';

export function StoryHero() {
  return (
    <NextImmersiveScroll framesPath="/immersive/scene">
      Story copy
    </NextImmersiveScroll>
  );
}
```

The demo app under `examples/next-demo` shows the App Router version of this setup.
