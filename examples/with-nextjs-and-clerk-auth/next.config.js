import path from 'path';
import { fileURLToPath } from 'url';

// Replicate __dirname behavior for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    swcPlugins: [['@lingui/swc-plugin', {}]],
  },
};

export default nextConfig;
