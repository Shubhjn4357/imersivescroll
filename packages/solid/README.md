# @immersive-scroll/solid

Solid adapter for immersive scroll scenes. It exposes Solid-friendly components and hooks while reusing the shared contracts and core runtime.

## Install

```bash
pnpm add @immersive-scroll/solid
```

## Main exports

- `ImmersiveScroll`
- `ImmersiveCanvas`
- `ImmersiveLayer`
- `ImmersiveFloating`
- `ImmersiveScrollbar`
- `ImmersiveTriggerZone`
- hooks for frame, progress, scroll, config, and triggers

## Quick start

```tsx
import { ImmersiveScroll } from '@immersive-scroll/solid';

export function StoryScene() {
  return (
    <ImmersiveScroll framesPath="/immersive/story">
      <section>Story content</section>
    </ImmersiveScroll>
  );
}
```

## Notes

- The Solid package mirrors the shared immersive concepts, but the React package remains the most feature-complete adapter in this workspace.
- Use this adapter when Solid owns the route shell and you want the same manifest and scroll model as the React implementation.
