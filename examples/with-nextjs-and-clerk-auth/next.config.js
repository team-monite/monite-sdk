import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    swcPlugins: [['@lingui/swc-plugin', {}]],
  },
  // Ensure Next picks the monorepo root correctly (avoids wrong root due to multiple lockfiles)
  outputFileTracingRoot: path.resolve(process.cwd(), '../../'),
  eslint: {
    // Limit ESLint to this app's sources to avoid crossing into the monorepo unintentionally
    dirs: ['src'],
  },
};

export default nextConfig;
