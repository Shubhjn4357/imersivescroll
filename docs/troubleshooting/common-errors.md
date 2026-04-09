# Common Errors

## Frames do not load

Check that `manifest.json` is in the public folder and that the frame file names match the manifest pattern.

## Scroll reacts but canvas stays blank

Confirm the renderer target exists and the frame URLs resolve in the browser.

## Demo app starts without visuals

Run `pnpm extract "<video-path>"` or `pnpm prepare:example-assets` so the example public folders have real assets.
