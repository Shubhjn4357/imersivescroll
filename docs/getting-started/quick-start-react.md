# Quick Start: React

```tsx
import { ImmersiveLayer, ImmersiveScroll } from 'immersive-scroll';

export function Hero() {
  return (
    <ImmersiveScroll
      framesPath="/immersive/ocean"
      overlay={<ImmersiveLayer className="hero-overlay" />}
      config={{ scrollbar: { enabled: true } }}
    >
      <section className="hero-copy">Foreground content</section>
    </ImmersiveScroll>
  );
}
```

Use `pnpm prepare:example-assets` first so `/immersive/ocean/manifest.json` exists in your app's public folder.
