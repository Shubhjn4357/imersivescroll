import { createWriteStream } from 'node:fs';
import { mkdir, stat } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { spawn } from 'node:child_process';
import { extractExampleSceneAssets } from './lib/exampleAssetPipeline.mjs';

const rootDirectory = process.cwd();
const requireFromCli = createRequire(
  path.join(rootDirectory, 'packages/cli/package.json')
);
const ffmpegPath = requireFromCli('ffmpeg-static');

const source = {
  author: 'Coverr',
  clipTitle: 'Close-up of a Futuristic Woman with Digital Patterns on Her Face',
  downloadHeaders: {
    origin: 'https://coverr.co',
    referer: 'https://coverr.co/stock-video-footage/futuristic-technology'
  },
  downloadUrl:
    'https://cdn.coverr.co/videos/coverr-close-up-of-a-futuristic-woman-with-digital-patterns-on-her-face/1080p.mp4',
  licenseUrl: 'https://coverr.co/license',
  pageUrl:
    'https://coverr.co/videos/close-up-of-a-futuristic-woman-with-digital-patterns-on-her-face'
};

const cacheDirectory = path.join(rootDirectory, '.cache', 'example-assets');
const downloadedSourcePath = path.join(
  cacheDirectory,
  'scene-remote-source.mp4'
);
const demoClipPath = path.join(
  rootDirectory,
  'examples',
  'assets',
  'scene-source.mp4'
);
const clipSettings = {
  trimDurationSeconds: 4,
  trimStartSeconds: 0.4
};

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

async function downloadIfNeeded() {
  await ensureDirectory(cacheDirectory);

  try {
    const sourceInfo = await stat(downloadedSourcePath);
    if (sourceInfo.size > 0) {
      return;
    }
  } catch {}

  const response = await fetch(source.downloadUrl, {
    headers: source.downloadHeaders
  });

  if (!response.ok || !response.body) {
    throw new Error(
      `Failed to download source video: ${response.status} ${response.statusText}`
    );
  }

  await pipeline(
    Readable.fromWeb(response.body),
    createWriteStream(downloadedSourcePath)
  );
}

async function buildTrimmedClip() {
  await ensureDirectory(path.dirname(demoClipPath));
  await runFfmpeg([
    '-y',
    '-ss',
    String(clipSettings.trimStartSeconds),
    '-t',
    String(clipSettings.trimDurationSeconds),
    '-i',
    downloadedSourcePath,
    '-an',
    demoClipPath
  ]);
}

await downloadIfNeeded();
await buildTrimmedClip();

const extractionResult = await extractExampleSceneAssets({
  author: source.author,
  licenseUrl: source.licenseUrl,
  rootDirectory,
  sceneTitle: source.clipTitle,
  sourcePageUrl: source.pageUrl,
  sourceVideoPath: demoClipPath
});

console.log(`Prepared example assets at ${extractionResult.scenePath}`);
