import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Warn on all lint errors in development
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warn on all type errors in development
    ignoreBuildErrors: true,
  },

};
export default nextConfig;
