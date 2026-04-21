# @immersive-scroll/horizontal-scroll

A high-performance React component for creating horizontal scroll sections pinned to vertical viewport progress.

## Installation

```bash
pnpm add @immersive-scroll/horizontal-scroll gsap
```

## Usage

```tsx
import { HorizontalScrollContainer } from '@immersive-scroll/horizontal-scroll';

export function ProductGallery() {
  return (
    <HorizontalScrollContainer scrub={1} pin={true} start="top top">
      <div className="horizontal-track">
        <ProductCard id={1} />
        <ProductCard id={2} />
        <ProductCard id={3} />
      </div>
    </HorizontalScrollContainer>
  );
}
```

## Props

| Prop             | Type                | Default      | Description                                               |
| :--------------- | :------------------ | :----------- | :-------------------------------------------------------- |
| `children`       | `React.ReactNode`   | **Required** | The content to be translated horizontally.                |
| `className`      | `string`            | `''`         | CSS class for the pinned container.                       |
| `trackClassName` | `string`            | `''`         | CSS class for the horizontal track.                       |
| `start`          | `string \| number`  | `'top top'`  | ScrollTrigger start position.                             |
| `scrub`          | `boolean \| number` | `1`          | Smoothness of the horizontal translation.                 |
| `pin`            | `boolean`           | `true`       | Whether to pin the container during horizontal traversal. |

## Why use this?

Most horizontal scroll implementations rely on fragile CSS hacks or heavy intersection observer logic. `@immersive-scroll/horizontal-scroll` uses GSAP and ScrollTrigger under the hood to ensure:

1.  **Pixel-Perfect Sync**: Movement is tied directly to the vertical scroll delta.
2.  **Hardware Acceleration**: Uses `will-change: transform` and optimized GPU layers.
3.  **Automatic Resizing**: Recalculates metrics on window resize for flawlessly responsive tracks.
4.  **Zero Layout Shifting**: The container pins in place, preventing jarring page JUMP.
