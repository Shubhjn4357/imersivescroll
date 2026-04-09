# Python Web Integration

This package suite does not render natively in Python. The supported pattern is to ship the browser bundle into a Django, Flask, or FastAPI template and point it at a pre-extracted public frame folder.

Typical flow:

1. Run `pnpm extract "<video-path>"` or `npx immersive-scroll extract ...` during your asset build.
2. Serve the generated `manifest.json` and frame files from your static directory.
3. Mount the web adapter in the rendered HTML page.
