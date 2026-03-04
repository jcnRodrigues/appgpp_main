import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev', '192.168.5.4:3000', '*.local-origin.dev:3000'],

};

export default nextConfig;
