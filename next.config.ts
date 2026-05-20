import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  devIndicators: false,
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
