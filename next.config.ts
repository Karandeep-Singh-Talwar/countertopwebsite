import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentUpgrade: 'security' as any,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      {
        source: '/stone-countertops',
        destination: '/porcelain-countertops',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
