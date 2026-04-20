import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/developer-portfolio',
  assetPrefix: '/developer-portfolio',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
