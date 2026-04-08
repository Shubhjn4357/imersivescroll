# Core API

Public core exports include:

- `createImmersiveEngine`
- `createFrameStore`
- `createScrollStore`
- `createPluginManager`
- `calculateFrameIndexFromProgress`
- `normalizeImmersiveConfig`
- `mergeImmersiveConfig`
- `validateFrameManifest`
- `validateFrameDirectoryContract`

The engine is the right abstraction when you need custom rendering shells instead of the packaged adapters.
