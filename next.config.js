/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Safe image optimization settings
  images: {
    domains: ["v0.blob.com"],
    unoptimized: true,
  },
  // Ensure CSS is properly processed
  webpack: (config) => {
    return config
  },
}

module.exports = nextConfig
