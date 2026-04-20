import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true
  },
  transpilePackages: [
    'immersive-scroll',
    '@immersive-scroll/next',
    '@immersive-scroll/react',
    '@immersive-scroll/core',
    '@immersive-scroll/shared',
    '@immersive-scroll/solid',
    '@immersive-scroll/svg-mask',
    '@immersive-scroll/web'
  ],
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      'immersive-scroll$': path.resolve(
        currentDirectory,
        '../../packages/immersive-scroll/src/index.ts'
      ),
      'immersive-scroll/next$': path.resolve(
        currentDirectory,
        '../../packages/immersive-scroll/src/next.ts'
      ),
      'immersive-scroll/solid$': path.resolve(
        currentDirectory,
        '../../packages/immersive-scroll/src/solid.ts'
      ),
      'immersive-scroll/web$': path.resolve(
        currentDirectory,
        '../../packages/immersive-scroll/src/web.ts'
      ),
      '@immersive-scroll/core$': path.resolve(
        currentDirectory,
        '../../packages/core/src/index.ts'
      ),
      '@immersive-scroll/next$': path.resolve(
        currentDirectory,
        '../../packages/next/src/index.ts'
      ),
      '@immersive-scroll/react$': path.resolve(
        currentDirectory,
        '../../packages/react/src/index.ts'
      ),
      '@immersive-scroll/shared$': path.resolve(
        currentDirectory,
        '../../packages/shared/src/index.ts'
      ),
      '@immersive-scroll/solid$': path.resolve(
        currentDirectory,
        '../../packages/solid/src/index.ts'
      ),
      '@immersive-scroll/svg-mask$': path.resolve(
        currentDirectory,
        '../../packages/svg-mask/src/index.ts'
      ),
      '@immersive-scroll/web$': path.resolve(
        currentDirectory,
        '../../packages/web/src/index.ts'
      )
    };

    return config;
  }
};

export default nextConfig;
