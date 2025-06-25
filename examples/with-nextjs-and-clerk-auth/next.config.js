/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: 'loose',
    serverComponentsExternalPackages: ['@monite/sdk-react'],
  },
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      const nodeModules = [
        'fs',
        'crypto',
        'stream',
        'path',
        'os',
        'util',
        'buffer',
        'net',
        'tls',
        'child_process',
        'http',
        'https',
        'zlib',
        'module',
        'url',
        'events',
        'querystring',
        'string_decoder',
        'assert',
        'cosmiconfig',
        'lazy-debug-legacy',
        'typescript',
        'jiti',
        'is-core-module',
        'resolve',
        'fs/promises',
        'gulp-sourcemaps',
        'vinyl-fs',
        'debug-fabulous',
      ];

      config.resolve.fallback = {
        ...config.resolve.fallback,
        ...Object.fromEntries(nodeModules.map((module) => [module, false])),
        buffer: 'buffer',
      };

      config.plugins.push(
        new webpack.DefinePlugin({
          'process.version': JSON.stringify('18.0.0'),
          'process.versions': JSON.stringify({ node: '18.0.0' }),
          'process.env.NODE_ENV': JSON.stringify(
            process.env.NODE_ENV || 'development'
          ),
        })
      );

      // Add Buffer polyfill for crypto operations
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        })
      );

      // Handle node: protocol by replacing with empty modules
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
          const moduleName = resource.request.replace(/^node:/, '');
          resource.request = 'data:text/javascript,module.exports = {}';
        })
      );
    }
    return config;
  },
};

export default nextConfig;
