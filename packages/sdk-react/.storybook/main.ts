import type { StorybookConfig } from '@storybook/react-webpack5';
import * as path from 'path';
import webpack, { Configuration, DefinePlugin, ProvidePlugin } from 'webpack';
import util from 'util';
import fs from 'fs';

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(tsx|mdx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-interactions',
    '@storybook/addon-essentials',
    '@storybook/addon-docs',
    '@storybook/addon-actions',
    '@storybook/addon-controls',
    '@storybook/addon-webpack5-compiler-swc',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {
      builder: {
        useSWC: true,
      },
    },
  },
  typescript: {
    reactDocgen: false,
  },
  staticDirs: ['../public'],
  webpackFinal: async (config: Configuration) => {
    config.plugins = config.plugins || [];

    let providePlugin = config.plugins.find(
      (plugin) => plugin && plugin.constructor && plugin.constructor.name === 'ProvidePlugin'
    ) as ProvidePlugin | undefined;

    if (providePlugin) {
      console.log('[Storybook webpackFinal for sdk-react] Found existing ProvidePlugin. Augmenting definitions.');
      providePlugin.definitions.Buffer = ['buffer', 'Buffer'];
      providePlugin.definitions.process = providePlugin.definitions.process || 'process/browser';
    } else {
      console.log('[Storybook webpackFinal for sdk-react] No existing ProvidePlugin found. Adding a new one.');
      config.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        })
      );
    }

    config.plugins.push(new DefinePlugin({
      'process.env': JSON.stringify({
        NODE_ENV: process.env.NODE_ENV || 'development',
        ENABLE_SENTRY: process.env.ENABLE_SENTRY || '',
      })
    }));

    const initialPluginCount = config.plugins.length;
    config.plugins = config.plugins.filter(
      (plugin) => plugin && plugin.constructor && plugin.constructor.name !== 'NodePolyfillPlugin'
    );
    if (config.plugins.length < initialPluginCount) {
      console.log('[Storybook webpackFinal for sdk-react] NodePolyfillPlugin was found (and removed) from Storybook defaults.');
    } else {
      console.log('[Storybook webpackFinal for sdk-react] NodePolyfillPlugin was NOT found by constructor name in Storybook defaults.');
    }

    config.resolve = config.resolve || {};
    config.resolve.extensions = [
      '.mjs',
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.json',
      ...(config.resolve.extensions || []).filter(
        (ext) => !['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'].includes(ext)
      ),
    ].filter((value, index, self) => self.indexOf(value) === index); // Ensure uniqueness

    config.resolve.mainFields = [
      'module',
      'browser',
      'main',
       ...((config.resolve.mainFields || []) as string[]).filter(
        (field: string) => !['module', 'browser', 'main'].includes(field)
      ),
    ].filter((value, index, self) => self.indexOf(value) === index); // Ensure uniqueness

    const newFallbacks: { [index: string]: string | false } = {
      process: require.resolve('process/browser'),
      buffer: require.resolve('buffer/'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      path: require.resolve('path-browserify'),
      util: require.resolve('util/'),
      assert: require.resolve('assert/'),
      fs: false,
      module: false,
      perf_hooks: path.resolve(__dirname, 'perf_hooks-shim.js'),
      os: false,
      tty: false,
      vm: false,
      // Add new fallbacks
      net: false,
      tls: false,
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      zlib: require.resolve('browserify-zlib'),
    };

    const existingFallbacks = { ...(config.resolve.fallback || {}) };
    if ('cosmiconfig' in existingFallbacks) {
      delete (existingFallbacks as { [key: string]: any }).cosmiconfig;
    }
    if ('@lingui/conf' in existingFallbacks) {
        delete (existingFallbacks as { [key: string]: any })['@lingui/conf'];
    }

    config.resolve.fallback = {
      ...existingFallbacks,
      ...newFallbacks
    } as { [index: string]: string | false };

    console.log('[Storybook webpackFinal for sdk-react] Configured resolve.fallback.');

    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });
    console.log('[Storybook webpackFinal for sdk-react] Added rule for .mjs files.');

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, '../src'),
      'jsdom': false,
      'canvas': false,
    };
    console.log('[Storybook webpackFinal for sdk-react] Configured resolve.alias (includes @).');

    try {
      fs.writeFileSync(
        path.resolve(__dirname, 'storybook-webpack.config.json'),
        util.inspect(config, { depth: 10, colors: false })
      );
      console.log('[Storybook webpackFinal for sdk-react] Successfully wrote webpack config to packages/sdk-react/.storybook/storybook-webpack.config.json');
    } catch (err) {
      console.error('[Storybook webpackFinal for sdk-react] Error writing webpack config:', err);
    }

    return config;
  },
  docs: {
    autodocs: 'tag',
  },
  swc: (swcConfig, options) => {
    console.log('[Storybook swc config for sdk-react] Original SWC config from Storybook:', JSON.stringify(swcConfig));
    return {
      ...(swcConfig || {}),
      jsc: {
        ...(swcConfig?.jsc || {}),
        parser: swcConfig?.jsc?.parser ?? {
          syntax: 'typescript',
          tsx: true,
          dynamicImport: true,
        },
        transform: {
          ...(swcConfig?.jsc?.transform || {}),
          react: {
            ...(swcConfig?.jsc?.transform?.react || {}),
            runtime: 'automatic',
            importSource: '@emotion/react',
          },
        },
      },
    };
  },
};

export default config;
