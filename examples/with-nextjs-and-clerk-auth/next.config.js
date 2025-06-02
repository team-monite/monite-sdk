import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   swcPlugins: [['@lingui/swc-plugin', {}]],
  // },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      const nodeModules = [
        'fs',
        'net',
        'tls',
        'fs/promises',
        'child_process',
        'crypto',
        'stream',
        'http',
        'https',
        'zlib',
        'path',
        'os',
      ];

      config.resolve.fallback = {
        ...config.resolve.fallback,
        ...Object.fromEntries(nodeModules.map((module) => [module, false])),
      };
    }

    return config;
  },

  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
