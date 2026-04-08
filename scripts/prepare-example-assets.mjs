import { createRequire } from 'node:module';
import { mkdir, readdir, rm, stat, writeFile, copyFile } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { spawn } from 'node:child_process';

const root = process.cwd();
const requireFromCli = createRequire(path.join(root, 'packages/cli/package.json'));
const ffmpegPath = requireFromCli('ffmpeg-static');

const source = {
  name: 'Ocean, sea, waves',
  pageUrl: 'https://pixabay.com/videos/ocean-sea-waves-aerial-view-drone-201418/',
  downloadUrl: 'https://cdn.pixabay.com/video/2024/02/21/201418-915375422_large.mp4',
  licenseUrl: 'https://pixabay.com/service/license-summary/',
  author: 'Oleh_1977'
};

const cacheDir = path.join(root, '.cache', 'example-assets');
const sourceVideoPath = path.join(cacheDir, 'ocean-source.mp4');
const clipPath = path.join(root, 'examples', 'assets', 'ocean-scroll-demo.mp4');
const framesTempDir = path.join(cacheDir, 'ocean-frames');
const examplePublicTargets = [
  path.join(root, 'examples/react-demo/public/immersive/ocean'),
  path.join(root, 'examples/next-demo/public/immersive/ocean'),
  path.join(root, 'examples/solid-demo/public/immersive/ocean'),
  path.join(root, 'examples/vanilla-demo/public/immersive/ocean')
];

const clipSettings = {
  trimStartSeconds: 1.1,
  trimDurationSeconds: 4,
  width: 640,
  height: 360,
  fps: 12,
  framePrefix: 'frame',
  format: 'jpg',
  quality: 82
};

async function ensureDirectory(directoryPath) {
  await mkdir(directoryPath, { recursive: true });
}

async function run(command, args) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} exited with code ${code ?? 1}`));
    });
  });
}

async function downloadIfNeeded() {
  await ensureDirectory(cacheDir);
  try {
    const info = await stat(sourceVideoPath);
    if (info.size > 0) {
      return;
    }
  } catch {}

  const response = await fetch(source.downloadUrl);
  if (!response.ok || !response.body) {
    throw new Error(`Failed to download source video: ${response.status} ${response.statusText}`);
  }

  await pipeline(Readable.fromWeb(response.body), createWriteStream(sourceVideoPath));
}

async function buildClip() {
  await ensureDirectory(path.dirname(clipPath));
  await run(ffmpegPath, [
    '-y',
    '-ss',
    String(clipSettings.trimStartSeconds),
    '-t',
    String(clipSettings.trimDurationSeconds),
    '-i',
    sourceVideoPath,
    '-vf',
    `scale=${clipSettings.width}:${clipSettings.height}:force_original_aspect_ratio=increase,crop=${clipSettings.width}:${clipSettings.height}`,
    '-an',
    clipPath
  ]);
}

async function extractFrames() {
  await rm(framesTempDir, { recursive: true, force: true });
  await ensureDirectory(framesTempDir);
  await run(ffmpegPath, [
    '-y',
    '-i',
    clipPath,
    '-vf',
    `fps=${clipSettings.fps},scale=${clipSettings.width}:${clipSettings.height}:force_original_aspect_ratio=increase,crop=${clipSettings.width}:${clipSettings.height}`,
    path.join(framesTempDir, `${clipSettings.framePrefix}-%05d.${clipSettings.format}`)
  ]);
}

async function buildOutputs() {
  const frameFiles = (await readdir(framesTempDir))
    .filter((fileName) => fileName.endsWith(`.${clipSettings.format}`))
    .sort();

  const manifest = {
    version: '1.0.0',
    videoHash: 'pixabay-ocean-scroll-demo',
    sourceVideo: source.downloadUrl,
    frameCount: frameFiles.length,
    fps: clipSettings.fps,
    width: clipSettings.width,
    height: clipSettings.height,
    format: clipSettings.format,
    quality: clipSettings.quality,
    framePattern: `${clipSettings.framePrefix}-%05d.${clipSettings.format}`,
    framePrefix: clipSettings.framePrefix,
    generatedAt: new Date().toISOString(),
    generator: 'immersive-scroll example asset prep',
    configFingerprint: `${clipSettings.fps}:${clipSettings.format}:${clipSettings.width}x${clipSettings.height}`,
    framesPath: '/immersive/ocean'
  };

  for (const targetDir of examplePublicTargets) {
    await rm(targetDir, { recursive: true, force: true });
    await ensureDirectory(targetDir);

    for (const frameFile of frameFiles) {
      await copyFile(path.join(framesTempDir, frameFile), path.join(targetDir, frameFile));
    }

    await writeFile(path.join(targetDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
    await writeFile(
      path.join(targetDir, 'frames.json'),
      JSON.stringify({ frames: frameFiles }, null, 2)
    );
    await writeFile(
      path.join(targetDir, 'SOURCE.md'),
      `# Demo Asset Source\n\n- Clip: ${source.name}\n- Author: ${source.author}\n- Source page: ${source.pageUrl}\n- License summary: ${source.licenseUrl}\n- Local clip: /examples/assets/${path.basename(clipPath)}\n`
    );
  }
}

await downloadIfNeeded();
await buildClip();
await extractFrames();
await buildOutputs();

console.log('Prepared example assets from web source:', source.pageUrl);
