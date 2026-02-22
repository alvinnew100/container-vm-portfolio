import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/container-vm-portfolio",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
