# Frame Pipeline

The supported production path is static pre-extraction.

1. Download or supply a source video.
2. Trim or preprocess it as needed.
3. Extract frame images into a deterministic folder.
4. Write `manifest.json` and `frames.json`.
5. Serve that folder as static assets.
6. Point the runtime at `framesPath` or `manifestPath`.

The example asset script automates this flow for the demo clip.
