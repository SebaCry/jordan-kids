import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@jordan-kids/db", "@jordan-kids/shared"],
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
