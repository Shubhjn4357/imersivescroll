# @immersive-scroll/react

React adapter for immersive scroll scenes. It bundles the provider, viewport/canvas composition, hooks, scrollbar, debug panel, and helper components needed to build scroll-driven storytelling UIs in React.

## Install

```bash
pnpm add @immersive-scroll/react
```

## Main exports

- `ImmersiveScroll`: root component that pins the viewport and drives the engine.
- `ImmersiveLayer`: overlay layer for HUDs, gradients, controls, and floating chrome.
- `ImmersiveFloating`, `ImmersiveTriggerZone`, `ImmersiveScrollbar`, `ImmersiveDebugPanel`
- Hooks including `useImmersiveFrame()`, `useImmersiveProgress()`, `useImmersiveScroll()`, and `useImmersiveScrollbar()`

## Quick start

```tsx
import {
  ImmersiveLayer,
  ImmersiveScroll,
  useImmersiveProgress
} from '@immersive-scroll/react';

function ProgressBadge() {
  const { progress } = useImmersiveProgress();
  return <span>Progress {Math.round(progress * 100)}%</span>;
}

export function StoryScene() {
  return (
    <ImmersiveScroll
      framesPath="/immersive/story"
      config={{ scrollbar: { enabled: true, visibilityMode: 'manual' } }}
      overlay={
        <ImmersiveLayer>
          <ProgressBadge />
        </ImmersiveLayer>
      }
    >
      <section>Story content</section>
    </ImmersiveScroll>
  );
}
```

## Notes

- The component tree is client-side and expects a public frame folder or explicit manifest path.
- Scrollbar placement and interactivity can be controlled through config or `scrollbarProps`.
- For Next.js-specific client wrappers, use `@immersive-scroll/next`.
