/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
  compiler: {
    emotion: true,
  },
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
