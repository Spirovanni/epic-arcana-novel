import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Temporarily ignore ESLint errors for faster testing
    ignoreDuringBuilds: true,
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
