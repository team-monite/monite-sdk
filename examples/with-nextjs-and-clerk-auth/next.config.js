/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
    swcPlugins: [['@lingui/swc-plugin', {}]],
  },
};

export default nextConfig;
