# immersive-scroll

Public package for immersive scroll scenes, typed runtime controls, and frame tooling.

## Install

```bash
pnpm add immersive-scroll
```

One install gives you the React runtime, framework entry points, shared config utilities, and the `immersive-scroll` CLI.

## React

```tsx
import {
  ImmersiveLayer,
  ImmersiveScroll,
  useImmersiveConfigControls
} from 'immersive-scroll';

export function HeroStory() {
  const controls = useImmersiveConfigControls({
    initialConfig: {
      visual: { objectFit: 'cover' },
      scrollbar: { enabled: true, visibilityMode: 'manual' }
    }
  });

  return (
    <ImmersiveScroll
      framesPath="/immersive/story"
      config={controls.config}
      overlay={<ImmersiveLayer>Scene chrome</ImmersiveLayer>}
    >
      <section>Foreground story content</section>
    </ImmersiveScroll>
  );
}
```

Pinned scenes default to a fixed full-screen viewport with an inset media layer. Use `viewportProps` or `mediaProps` only when the route needs a contained scene, custom offsets, or a different stacking order.

## CLI

```bash
pnpm exec immersive-scroll extract ./assets/story.mp4 ./public/immersive/story --clean
pnpm exec immersive-scroll validate ./public/immersive/story
pnpm exec immersive-scroll doctor
```

## Entry points

- `immersive-scroll`: React components, hooks, config/control helpers, shared config utilities, scrollbar, and debug UI.
- `immersive-scroll/next`: Next.js client-only helpers and wrappers.
- `immersive-scroll/solid`: Solid adapter surface.
- `immersive-scroll/web`: Vanilla DOM API and custom-element helpers.

Installing `immersive-scroll` also ships the `immersive-scroll` CLI for frame extraction, validation, repair, and manifest tooling.
