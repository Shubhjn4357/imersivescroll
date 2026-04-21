# @immersive-scroll/shared

## 0.1.2

### Patch Changes

- 5e9377b: change the design of whole arch
- ab2074b: the pinned viewport resolves to position: fixed with inset: 0, the media stays full-bleed, and the story content is kept on an explicit higher layer. I aligned the package defaults in Solid and web too in ImmersiveScroll.tsx and createContainerStructure.ts. The override props still work, so if a route needs the scene above extra chrome you can raise it with viewportProps.zIndex.

## 0.1.1

### Patch Changes

- Patch release for the immersive scroll package graph.

  This release rolls up the recent runtime, docs, asset-pipeline, and shared utility improvements across the published packages.
