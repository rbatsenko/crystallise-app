import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@crystallise/supabase"],
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
};

export default nextConfig;
