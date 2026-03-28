import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  turbopack: {
    // Set the root to the parent directory
    root: path.join(__dirname, '..'),
  },
};

export default nextConfig;