import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Allows Google Profile Pictures
      },
      {
        protocol: 'https',
        hostname: 'openweathermap.org', // Useful if we add weather icons later
      }
    ],
  },
};

export default nextConfig;