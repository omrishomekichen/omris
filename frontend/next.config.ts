import type { NextConfig } from "next";

const apiBaseUrl = process.env.PUBLIC_URL?.replace(/\/$/, "");

if (!apiBaseUrl) {
  throw new Error("PUBLIC_URL must be configured in .env.");
}

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.11'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiBaseUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
