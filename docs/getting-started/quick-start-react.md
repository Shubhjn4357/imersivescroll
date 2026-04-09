# Quick Start: React

```tsx
import { ImmersiveLayer, ImmersiveScroll } from 'immersive-scroll';

export function Hero() {
  return (
    <ImmersiveScroll
      framesPath="/immersive/scene"
      overlay={<ImmersiveLayer className="hero-overlay" />}
      config={{ scrollbar: { enabled: true } }}
    >
      <section className="hero-copy">Foreground content</section>
    </ImmersiveScroll>
  );
}
```

Use `pnpm extract "<video-path>"` first so `/immersive/scene/manifest.json` exists in your app's public folder.
