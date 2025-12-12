import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Temporarily ignore ESLint errors for faster testing
    ignoreDuringBuilds: true,
  },
  // Exclude local data dumps from serverless bundles to keep function size small
  outputFileTracingExcludes: {
    '*': [
      './data/**',
      './data/career data/**',
    ],
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        // Apply CSP headers specifically for the 3D character arcs page
        source: '/features/character-arcs-3d',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; worker-src 'self' blob:; child-src 'self' blob:; connect-src 'self';"
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    // Fix for worker modules in Three.js
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
