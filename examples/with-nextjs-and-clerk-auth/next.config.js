/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: 'loose',
    serverComponentsExternalPackages: ['@monite/sdk-react'],
  },
  webpack: (config, { isServer, webpack }) => {
    if (isServer) {
      // Target externalization only for the SDK package itself
      config.externals.push(({ request }, callback) => {
        if (request === '@monite/sdk-react') {
          return callback(null, `commonjs ${request}`);
        }
        callback();
      });
    } else {
      // Client-side: Replace some problematic Node.js-specific packages with empty modules
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /^(cosmiconfig|lazy-debug-legacy|typescript|jiti|gulp-sourcemaps|vinyl-fs|debug-fabulous|is-core-module|resolve)$/,
          'data:text/javascript,module.exports = {}'
        )
      );

      // Add a custom plugin to handle node: protocol
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
          const moduleName = resource.request.replace(/^node:/, '');
          switch (moduleName) {
            case 'assert':
            case 'fs':
            case 'net':
            case 'tls':
            case 'child_process':
            case 'http':
            case 'https':
            case 'zlib':
            case 'os':
            case 'module':
            case 'url':
            case 'events':
            case 'querystring':
            case 'string_decoder':
            case 'path':
            case 'stream':
            case 'buffer':
            case 'util':
              resource.request = 'data:text/javascript,module.exports = {}';
              break;
            case 'process':
              resource.request =
                'data:text/javascript,module.exports = { versions: { node: "18.0.0" }, env: {}, platform: "browser", cwd: () => "/", nextTick: (fn) => setTimeout(fn, 0) }';
              break;
            case 'crypto':
              resource.request = 'crypto-browserify';
              break;
            default:
              resource.request = 'data:text/javascript,module.exports = {}';
          }
        })
      );

      // Client-side fallbacks - use proper polyfills instead of false
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        fs: false,
        path: 'path-browserify',
        crypto: 'crypto-browserify',
        stream: 'stream-browserify',
        buffer: 'buffer',
        process: 'process/browser',
        util: 'util',
        net: false,
        tls: false,
        child_process: false,
        'fs/promises': false,
        http: false,
        https: false,
        zlib: false,
        os: false,
        assert: false,
        module: false,
        url: false,
        events: false,
        querystring: false,
        string_decoder: false,
        cosmiconfig: false,
        'lazy-debug-legacy': false,
        typescript: false,
        jiti: false,
        'is-core-module': false,
        resolve: false,
      };

      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
          crypto: 'crypto-browserify',
        })
      );

      config.plugins.push(
        new webpack.DefinePlugin({
          'process.versions.node': JSON.stringify('18.0.0'),
          'process.env': JSON.stringify({}),
          'process.platform': JSON.stringify('browser'),
          global: 'globalThis',
        })
      );

      config.resolve.alias = {
        ...config.resolve.alias,
        crypto: 'crypto-browserify',
        'node:crypto': 'crypto-browserify',
        crypto1: 'crypto-browserify',
      };
    }

    return config;
  },
};

export default nextConfig;
