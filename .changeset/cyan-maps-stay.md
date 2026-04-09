---
'immersive-scroll': patch
'@immersive-scroll/shared': patch
'@immersive-scroll/react': patch
'@immersive-scroll/solid': patch
'@immersive-scroll/core': patch
'@immersive-scroll/next': patch
'@immersive-scroll/cli': patch
'@immersive-scroll/web': patch
---

the pinned viewport resolves to position: fixed with inset: 0, the media stays full-bleed, and the story content is kept on an explicit higher layer. I aligned the package defaults in Solid and web too in ImmersiveScroll.tsx and createContainerStructure.ts. The override props still work, so if a route needs the scene above extra chrome you can raise it with viewportProps.zIndex.
