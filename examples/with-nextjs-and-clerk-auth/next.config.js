/** @type {import('next').NextConfig} */
const nextConfig = {
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
        'assert',
        'module',
        'url',
        'util',
        'events',
        'buffer',
        'querystring',
        'string_decoder',
      ];

      // Handle both regular and node: protocol imports
      config.resolve.fallback = {
        ...config.resolve.fallback,
        ...Object.fromEntries(nodeModules.map((module) => [module, false])),
        ...Object.fromEntries(nodeModules.map((module) => [`node:${module}`, false])),
      };

      // Mark server-only dependencies as external to prevent bundling
      config.externals = {
        ...config.externals,
        jiti: 'jiti',
        cosmiconfig: 'cosmiconfig',
        'cosmiconfig-typescript-loader': 'cosmiconfig-typescript-loader',
        'tsx': 'tsx',
        'esbuild': 'esbuild',
        'tsup': 'tsup',
      };

      // Add alias for node: protocol imports
      config.resolve.alias = {
        ...config.resolve.alias,
        ...Object.fromEntries(nodeModules.map((module) => [`node:${module}`, false])),
      };
    }

    return config;
  },
};

export default nextConfig;
