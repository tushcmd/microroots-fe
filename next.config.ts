import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  allowedDevOrigins: ["169.58.210.23", "localhost", "127.0.0.1"],
}

export default nextConfig
