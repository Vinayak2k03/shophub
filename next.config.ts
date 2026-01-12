import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "icon.in",
      },
      {
        protocol: "https",
        hostname: "dlcdnwebimgs.asus.com",
      },
    ],
  },
  // Production optimizations
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
