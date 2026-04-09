# Quick Start: Vanilla Web

```ts
import { createImmersiveInstance } from 'immersive-scroll/web';

const hero = document.querySelector('#hero');
if (hero) {
  createImmersiveInstance({
    container: hero,
    framesPath: '/immersive/scene'
  });
}
```

This is the lightest path for CMS pages, marketing pages, or server-rendered HTML that only needs a progressive enhancement layer.
