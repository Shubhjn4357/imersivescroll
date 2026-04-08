# CLI API

Commands:

- `npx immersive-scroll extract <video> <output-folder>`
- `npx immersive-scroll validate <frames-folder>`
- `npx immersive-scroll repair <video> <frames-folder>`
- `npx immersive-scroll manifest <frames-folder>`
- `npx immersive-scroll hash <video>`
- `npx immersive-scroll doctor`

The CLI now uses `ffmpeg-static` so the repo examples can prepare assets without relying on a global ffmpeg install.
