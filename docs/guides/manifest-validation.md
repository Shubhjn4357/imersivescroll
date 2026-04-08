# Manifest Validation

A valid manifest should describe:

- frame count
- fps
- width and height
- image format
- frame file pattern and prefix
- source hash or fingerprint

Use `npx immersive-scroll validate ./public/immersive/hero` in CI to catch missing or mismatched frame folders before deployment.
