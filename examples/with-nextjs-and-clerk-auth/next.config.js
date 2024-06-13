/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
    swcPlugins: [['@lingui/swc-plugin', {}]],
  },
  compiler: {
    emotion: true,
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;

    config.module.rules.push({
      test: /\.po$/,
      use: { loader: '@lingui/loader' },
    });

    return config;
  },
};

export default nextConfig;
