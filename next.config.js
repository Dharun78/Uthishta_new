/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Required for Docker deployment
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  // Optimize for production
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
}

module.exports = nextConfig
