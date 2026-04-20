# Immersive Scroll: Agent Guide

This document is designed for AI coding assistants to quickly understand the architecture and usage patterns of the Immersive Scroll ecosystem.

## 🚀 Overview

`immersive-scroll` is a high-fidelity scrollytelling engine optimized for frame-sequence narratives. It handles the "hard parts" of cinematic web experiences: hardware-accelerated frame scrubbing, viewport pinning, scroll state mapping, and cinematic transitions.

### Key Packages

1.  **`immersive-scroll`**: The core engine. Includes framework-agnostic logic and adapters for React, Next.js, Solid, and Vanilla Web.
2.  **`@immersive-scroll/svg-mask`**: A motion-driven reveal engine using SVG masks for cinematic transitions between sections.

---

## 🏗 Architecture Patterns

### The Scene Lifecycle

1.  **Asset Extraction**: Use the CLI to convert video or image sequences into optimized WebP frames + a `manifest.json`.
2.  **Scene Mounting**: The `<ImmersiveScroll />` component pins a viewport and renders frames to a high-performance `<canvas>`.
3.  **State Observation**: Use hooks (e.g., `useImmersiveProgress`) to drive overlay animations in sync with the scroll.
4.  **Tuning**: Use `useImmersiveConfigControls` for real-time visual and motion adjustments.

---

## 🛠 Usage Guide

### 1. Immersive Scroll (Core)

Standard implementation for a React/Next.js environment:

```tsx
import { ImmersiveScroll, ImmersiveLayer } from 'immersive-scroll/react';

export function MyScene() {
  return (
    <ImmersiveScroll
      framesPath="/assets/scene-1"
      manifestPath="/assets/scene-1/manifest.json"
      config={{
        scroll: { smooth: true, lerp: 0.1 },
        visual: { objectFit: 'cover' }
      }}
    >
      <ImmersiveLayer>
        {/* Your HTML/React overlays that react to scroll here */}
        <h1>Cinema in the browser</h1>
      </ImmersiveLayer>
    </ImmersiveScroll>
  );
}
```

### 2. SVG Reveal Mask

Used for transitioning from standard content into an immersive scene.

```tsx
import { ImmersiveSvgMask } from '@immersive-scroll/svg-mask';

<ImmersiveSvgMask
  variant="pill" // options: 'pill' | 'circle' | 'rect' | 'custom'
  softness={20} // edge blur
  parallax={0.4} // content depth effect
  maskPath={variant === 'custom' ? '...' : undefined}
>
  <div className="hero-content">
    <h2>Reveal your story</h2>
  </div>
</ImmersiveSvgMask>;
```

---

## 💡 AI Tips & Best Practices

- **Viewport Centering**: Always ensure the parent container of `ImmersiveScroll` has a defined height (usually `100vh`) or is allowed to expand.
- **Hardware Acceleration**: The engine uses CSS GPU transforms and Canvas2D filters. Avoid adding heavy `backdrop-filter` on top of the main canvas if performance dips on mobile.
- **Custom Masks**: For `variant="custom"`, provide a standard SVG path `d` string. The engine automatically handles normalization and centering via `transform-box: fill-box`.
- **Debug Mode**: Enable `config.debug.enabled: true` during development to see live frame indices and scroll velocity.
- **Asset Paths**: Always use absolute paths or relative paths that resolve correctly from the public root of the host application.

---

## 🔧 Workflow Tools

- `pnpm extract "<video-path>"`: Generates frames and manifest.
- `pnpm dev:landing`: Runs the playground and documentation site.
- `useImmersiveConfigControls()`: The source of truth for tuning the `PartialImmersiveConfig` object.
