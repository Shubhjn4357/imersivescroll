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
    '@immersive-scroll/shared'
  ]
};

export default nextConfig;
