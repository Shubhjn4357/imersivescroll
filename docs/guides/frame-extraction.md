# Frame Extraction Guide

The repo ships a reproducible example flow:

```bash
pnpm prepare:example-assets
```

That script:

1. downloads the demo source clip from https://pixabay.com/videos/ocean-sea-waves-aerial-view-drone-201418/
2. trims it into `examples/assets/ocean-scroll-demo.mp4`
3. extracts a local JPG frame sequence
4. writes `manifest.json` and `frames.json`
5. copies the output into every example app's public folder

For your own project, replace the source clip and output path, then run the CLI extract command during asset build time.
