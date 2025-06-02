import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';
import webpack, { Configuration } from 'webpack';
import util from 'util';
import fs from 'fs';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-styling-webpack',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  webpackFinal: async (config: Configuration) => {
    config.plugins = config.plugins || [];

    const initialPluginCount = config.plugins.length;
    config.plugins = config.plugins.filter(
      (plugin) => plugin && plugin.constructor && plugin.constructor.name !== 'NodePolyfillPlugin'
    );
    if (config.plugins.length < initialPluginCount) {
      console.log('[Storybook webpackFinal] NodePolyfillPlugin was found and removed.');
    } else {
      console.log('[Storybook webpackFinal] NodePolyfillPlugin was NOT found by constructor name.');
    }

    if (!config.plugins.some(p => p && p.constructor && p.constructor.name === 'ProvidePlugin' && (p as any).definitions && (p as any).definitions.process)) {
      config.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        })
      );
      console.log('[Storybook webpackFinal] Added ProvidePlugin for process and Buffer.');
    }

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.versions': JSON.stringify({ node: '20.0.0' }),
        'process.versions.node': JSON.stringify('20.0.0'),
        'process.platform': JSON.stringify('browser'),
        'process.env': JSON.stringify({}) 
      })
    );
    console.log('[Storybook webpackFinal] Added DefinePlugin for process.versions, process.platform, and process.env.');

    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      process: require.resolve('process/browser'),
      buffer: require.resolve('buffer/'),
      perf_hooks: false,
      module: false,
      fs: false,
      path: require.resolve("path-browserify"),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
    };
    console.log('[Storybook webpackFinal] Ensured resolve.fallback for process, buffer, and others.');
    
    config.resolve.alias = {
        ...(config.resolve.alias || {}),
        '@': path.resolve(__dirname, '../src'),
    };

    if (process.env.STORYBOOK_DEBUG_WEBPACK === 'true') {
      try {
        fs.writeFileSync(
          path.resolve(__dirname, 'storybook-webpack.config.json'),
          util.inspect(config, { depth: 10, colors: false }) 
        );
        console.log('[Storybook webpackFinal] Successfully wrote webpack config to .storybook/storybook-webpack.config.json');
      } catch (err) {
        console.error('[Storybook webpackFinal] Error writing webpack config:', err);
      }
    }
    
    return config;
  },
};
export default config; 