# @immersive-scroll/web

Framework-free DOM API and custom-element wrapper for immersive scroll scenes. Use this package when you need a runtime that can be mounted imperatively or dropped into a CMS or non-framework shell.

## Install

```bash
pnpm add @immersive-scroll/web
```

## Main exports

- `createImmersiveInstance()`: mount an immersive scene into an existing container.
- `destroyImmersiveInstance()`: dispose a mounted instance explicitly.
- `registerImmersiveCustomElement()`: register `<immersive-scroll>`.
- `ImmersiveScrollElement`: the custom-element implementation.

## Imperative example

```ts
import { createImmersiveInstance } from '@immersive-scroll/web';

const container = document.querySelector('#scene');

if (container instanceof HTMLElement) {
  createImmersiveInstance({
    container,
    framesPath: '/immersive/story'
  });
}
```

## Custom element example

```ts
import { registerImmersiveCustomElement } from '@immersive-scroll/web';

registerImmersiveCustomElement();
```

```html
<immersive-scroll frames-path="/immersive/story"></immersive-scroll>
```
