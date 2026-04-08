# Core Engine

The core engine created by `createImmersiveEngine` owns these responsibilities:

- normalize partial config into a stable runtime config
- load and validate the manifest
- map scroll progress to frame indices
- select and resize the renderer
- broadcast typed lifecycle events
- expose state stores for frame and scroll subscriptions

This keeps framework packages thin and makes it easier to add future adapters without cloning the runtime.
