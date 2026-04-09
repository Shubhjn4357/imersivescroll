import path from 'node:path';
import {
  DEFAULT_MAX_FRAMES,
  EXAMPLE_SCENE_PATH,
  extractExampleSceneAssets,
  resolveSceneTitle
} from './lib/exampleAssetPipeline.mjs';

const rootDirectory = process.cwd();
const sourceVideoArgument = process.argv[2];

if (!sourceVideoArgument) {
  console.error('Usage: pnpm extract "<video-path>"');
  process.exit(1);
}

const resolvedSourceVideoPath = path.resolve(
  rootDirectory,
  sourceVideoArgument
);
try {
  const extractionResult = await extractExampleSceneAssets({
    rootDirectory,
    sceneTitle: resolveSceneTitle(resolvedSourceVideoPath),
    sourceVideoPath: resolvedSourceVideoPath
  });

  console.log(
    `Extracted ${extractionResult.frameCount} ${extractionResult.format.toUpperCase()} frames from ${extractionResult.sourceVideoPath}`
  );
  console.log(
    `Auto-selected ${extractionResult.fps} fps from source ${extractionResult.videoMetadata.fps.toFixed(2)} fps to stay within ${DEFAULT_MAX_FRAMES} frames`
  );
  console.log(
    `Output tuned to ${extractionResult.width}x${extractionResult.height} at quality ${extractionResult.quality}`
  );
  console.log(`Updated example assets at ${extractionResult.scenePath}`);
} catch (error) {
  const message =
    error instanceof Error ? error.message : 'Video extraction failed.';

  console.error(message);
  console.error(`Expected output path: ${EXAMPLE_SCENE_PATH}`);
  process.exit(1);
}
