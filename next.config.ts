import type { NextConfig } from "next";

const fallbackOrigins = [
  "localhost",
  "localhost:3000",
  "127.0.0.1",
  "127.0.0.1:3000",
  "192.168.5.4",
  "192.168.5.4:3000",
  "local-origin.dev",
  "*.local-origin.dev",
];

const envOrigins = process.env.DEV_ALLOWED_ORIGINS
  ? process.env.DEV_ALLOWED_ORIGINS.split(",").map((item) => item.trim()).filter(Boolean)
  : [];

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: envOrigins.length > 0 ? envOrigins : fallbackOrigins,
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "/api/pages-auth/:path*",
      },
    ];
  },
};

export default nextConfig;
