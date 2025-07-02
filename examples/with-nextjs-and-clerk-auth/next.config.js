/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        crypto: false,
        stream: false,
        path: false,
        os: false,
        util: false,
        net: false,
        tls: false,
        child_process: false,
        http: false,
        https: false,
        zlib: false,
        url: false,
        events: false,
        querystring: false,
        string_decoder: false,
        assert: false,
        buffer: 'buffer',
      };
    }

    return config;
  },

  transpilePackages: ['@monite/sdk-react'],
  experimental: {
    esmExternals: 'loose',
  },
};

export default nextConfig;
