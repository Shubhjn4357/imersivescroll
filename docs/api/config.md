# Config API

The main public config type is `ImmersiveConfig`.

Important sections:

- `mode`: static pre-extracted or remote manifest.
- `scroll`: smoothing, multipliers, spring settings, orientation.
- `trigger`: start, end, scrub, pin, markers.
- `visual`: fit, position, overlay opacity, brightness, contrast, saturate, blur.
- `scrollbar`: enablement and appearance.
- `mobile`: frame reduction and small-screen behavior.
- `debug`: frame, velocity, progress, and manifest panels.

Use `normalizeImmersiveConfig` to turn a partial config into the runtime shape.
