/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable proper TypeScript and ESLint checking for production builds
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
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
