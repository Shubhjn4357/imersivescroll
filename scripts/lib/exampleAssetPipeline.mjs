import { createRequire } from 'node:module';
import { createReadStream } from 'node:fs';
import {
  copyFile,
  link,
  mkdir,
  mkdtemp,
  readdir,
  rm,
  stat,
  writeFile
} from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';

const requireFromCli = createRequire(
  path.join(process.cwd(), 'packages/cli/package.json')
);
const ffmpegPath = requireFromCli('ffmpeg-static');

export const EXAMPLE_SCENE_KEY = 'scene';
export const EXAMPLE_SCENE_PATH = `/immersive/${EXAMPLE_SCENE_KEY}`;
export const DEFAULT_MAX_FRAMES = 250;

const DEFAULT_MAX_LONG_EDGE = 1920;

const exampleAppNames = [
  'react-demo',
  'next-demo',
  'solid-demo',
  'vanilla-demo'
];

function toPosixPath(filePath) {
  return filePath.split(path.sep).join('/');
}

function resolveRepoRelativePath(rootDirectory, targetPath) {
  return toPosixPath(path.relative(rootDirectory, targetPath));
}

function normalizeSceneTitle(videoPath) {
  const baseName = path.basename(videoPath, path.extname(videoPath));
  return baseName.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function resolveAutoFps(sourceFps) {
  if (sourceFps >= 29.5) {
    return 30;
  }

  if (sourceFps >= 23.5) {
    return 24;
  }

  return Math.max(12, Math.round(sourceFps));
}

function roundEven(value) {
  return Math.max(2, Math.round(value / 2) * 2);
}

function roundPrecision(value) {
  return Number(value.toFixed(3));
}

function resolveOutputDimensions(videoMetadata) {
  const longEdge = Math.max(videoMetadata.width, videoMetadata.height);
  if (longEdge <= DEFAULT_MAX_LONG_EDGE) {
    return {
      width: videoMetadata.width,
      height: videoMetadata.height
    };
  }

  const scale = DEFAULT_MAX_LONG_EDGE / longEdge;
  return {
    width: roundEven(videoMetadata.width * scale),
    height: roundEven(videoMetadata.height * scale)
  };
}

function resolveTargetFps(videoMetadata, maxFrames = DEFAULT_MAX_FRAMES) {
  const baseFps = resolveAutoFps(videoMetadata.fps);
  const duration = Math.max(videoMetadata.duration, 0.001);
  const limitedFps = Math.max(maxFrames / duration, 1 / duration);
  return roundPrecision(Math.min(baseFps, limitedFps));
}

function estimateFrameCount(videoMetadata, fps) {
  return Math.max(1, Math.floor(videoMetadata.duration * fps));
}

function resolveAutoQuality(width, height, estimatedFrameCount) {
  const pixelBudget = width * height * estimatedFrameCount;

  if (pixelBudget >= 1_000_000_000) {
    return 68;
  }

  if (pixelBudget >= 700_000_000) {
    return 72;
  }

  if (pixelBudget >= 400_000_000) {
    return 76;
  }

  if (pixelBudget >= 220_000_000) {
    return 80;
  }

  return 82;
}

async function ensureDirectory(directoryPath) {
  await mkdir(directoryPath, { recursive: true });
}

async function runFfmpeg(args) {
  await new Promise((resolve, reject) => {
    const child = spawn(ffmpegPath, args, { stdio: 'inherit' });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`ffmpeg exited with code ${code ?? 1}`));
    });
  });
}

async function loadVideoMetadata(videoPath) {
  const output = await new Promise((resolve, reject) => {
    const child = spawn(ffmpegPath, ['-i', videoPath]);
    let stderr = '';

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', reject);
    child.on('exit', () => resolve(stderr));
  });

  const durationMatch = output.match(/Duration:\s+(\d+):(\d+):(\d+\.\d+)/);
  const streamMatch = output.match(
    /Video:.*?,\s+(\d+)x(\d+).*?(\d+(?:\.\d+)?)\s+fps/
  );

  if (!durationMatch || !streamMatch) {
    throw new Error('Unable to parse video metadata from ffmpeg output.');
  }

  const [, hours, minutes, seconds] = durationMatch;
  const [, width, height, fps] = streamMatch;

  return {
    duration: Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds),
    fps: Number(fps),
    height: Number(height),
    width: Number(width)
  };
}

async function hashVideoSource(videoPath) {
  const hash = createHash('sha256');

  await new Promise((resolve, reject) => {
    const stream = createReadStream(videoPath);

    stream.on('data', (chunk) => {
      hash.update(chunk);
    });
    stream.on('error', reject);
    stream.on('end', resolve);
  });

  return hash.digest('hex');
}

async function clearDirectoryContents(directoryPath) {
  await ensureDirectory(directoryPath);
  const entries = await readdir(directoryPath);

  await Promise.all(
    entries.map((entryName) =>
      rm(path.join(directoryPath, entryName), { recursive: true, force: true })
    )
  );
}

async function linkOrCopyFile(sourcePath, targetPath) {
  try {
    await link(sourcePath, targetPath);
  } catch {
    await copyFile(sourcePath, targetPath);
  }
}

function buildSourceDocument({
  author,
  licenseUrl,
  localClipPath,
  sceneTitle,
  sourcePageUrl
}) {
  const lines = ['# Demo Asset Source', '', `- Clip: ${sceneTitle}`];

  if (author) {
    lines.push(`- Author: ${author}`);
  }

  if (sourcePageUrl) {
    lines.push(`- Source page: ${sourcePageUrl}`);
  }

  if (licenseUrl) {
    lines.push(`- License summary: ${licenseUrl}`);
  }

  lines.push(`- Local clip: /${localClipPath}`);

  return `${lines.join('\n')}\n`;
}

function buildManifest({
  author,
  format,
  fps,
  frameCount,
  framePrefix,
  licenseUrl,
  outputDimensions,
  quality,
  sceneTitle,
  sourcePageUrl,
  sourceVideo,
  videoHash,
  videoMetadata
}) {
  return {
    version: '1.0.0',
    videoHash,
    sourceVideo,
    frameCount,
    fps,
    width: outputDimensions.width,
    height: outputDimensions.height,
    title: sceneTitle,
    author,
    format,
    quality,
    framePattern: `${framePrefix}-%05d.${format}`,
    framePrefix,
    generatedAt: new Date().toISOString(),
    generator: 'immersive-scroll root extract',
    configFingerprint: `${fps}:${format}:${quality}:${outputDimensions.width}x${outputDimensions.height}:${frameCount}`,
    framesPath: EXAMPLE_SCENE_PATH,
    sourcePageUrl,
    licenseUrl
  };
}

export async function extractExampleSceneAssets({
  author = null,
  licenseUrl = null,
  maxFrames = DEFAULT_MAX_FRAMES,
  quality = null,
  rootDirectory,
  sceneTitle,
  sourcePageUrl = null,
  sourceVideoPath
}) {
  const resolvedVideoPath = path.resolve(rootDirectory, sourceVideoPath);
  const videoInfo = await stat(resolvedVideoPath);
  if (!videoInfo.isFile()) {
    throw new Error(`Expected a file at ${resolvedVideoPath}`);
  }

  const videoMetadata = await loadVideoMetadata(resolvedVideoPath);
  const outputDimensions = resolveOutputDimensions(videoMetadata);
  const targetFps = resolveTargetFps(videoMetadata, maxFrames);
  const resolvedQuality =
    quality ??
    resolveAutoQuality(
      outputDimensions.width,
      outputDimensions.height,
      estimateFrameCount(videoMetadata, targetFps)
    );
  const cacheDirectory = path.join(rootDirectory, '.cache', 'example-assets');
  const framePrefix = 'frame';
  const format = 'webp';

  await ensureDirectory(cacheDirectory);
  const tempFramesDirectory = await mkdtemp(
    path.join(cacheDirectory, `${EXAMPLE_SCENE_KEY}-frames-`)
  );

  await runFfmpeg([
    '-y',
    '-i',
    resolvedVideoPath,
    '-vf',
    `scale=${outputDimensions.width}:${outputDimensions.height}:flags=lanczos,fps=${targetFps}:round=down`,
    '-an',
    '-c:v',
    'libwebp',
    '-quality',
    String(resolvedQuality),
    '-compression_level',
    '4',
    path.join(tempFramesDirectory, `${framePrefix}-%05d.${format}`)
  ]);

  const frameFiles = (await readdir(tempFramesDirectory))
    .filter((fileName) => fileName.endsWith(`.${format}`))
    .sort();

  const localClipPath = resolveRepoRelativePath(
    rootDirectory,
    resolvedVideoPath
  );
  const manifest = buildManifest({
    author,
    format,
    fps: targetFps,
    frameCount: frameFiles.length,
    framePrefix,
    licenseUrl,
    outputDimensions,
    quality: resolvedQuality,
    sceneTitle,
    sourcePageUrl,
    sourceVideo: `/${localClipPath}`,
    videoHash: await hashVideoSource(resolvedVideoPath),
    videoMetadata
  });
  const sourceDocument = buildSourceDocument({
    author,
    licenseUrl,
    localClipPath,
    sceneTitle,
    sourcePageUrl
  });

  try {
    for (const exampleAppName of exampleAppNames) {
      const immersiveRoot = path.join(
        rootDirectory,
        'examples',
        exampleAppName,
        'public',
        'immersive'
      );
      const sceneDirectory = path.join(immersiveRoot, EXAMPLE_SCENE_KEY);

      await clearDirectoryContents(immersiveRoot);
      await ensureDirectory(sceneDirectory);

      for (const frameFileName of frameFiles) {
        await linkOrCopyFile(
          path.join(tempFramesDirectory, frameFileName),
          path.join(sceneDirectory, frameFileName)
        );
      }

      await writeFile(
        path.join(sceneDirectory, 'manifest.json'),
        JSON.stringify(manifest, null, 2)
      );
      await writeFile(
        path.join(sceneDirectory, 'frames.json'),
        JSON.stringify({ frames: frameFiles }, null, 2)
      );
      await writeFile(path.join(sceneDirectory, 'SOURCE.md'), sourceDocument);
    }
  } finally {
    await rm(tempFramesDirectory, { recursive: true, force: true });
  }

  return {
    format,
    fps: targetFps,
    frameCount: frameFiles.length,
    height: outputDimensions.height,
    maxFrames,
    quality: resolvedQuality,
    scenePath: EXAMPLE_SCENE_PATH,
    sourceVideoPath: localClipPath,
    width: outputDimensions.width,
    videoMetadata
  };
}

export function resolveSceneTitle(videoPath) {
  return normalizeSceneTitle(videoPath);
}
