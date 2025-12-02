import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${
          process.env.BACKEND_URL || "http://localhost:7788"
        }/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
