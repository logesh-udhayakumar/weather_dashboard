/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'openweathermap.org',
        pathname: '/img/wn/**',
      },
    ],
  },
  // serverComponentsExternalPackages covers RSC; webpack externals covers API Route Handlers
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Prevent these native packages from being bundled by webpack.
      // This is required for App Router Route Handlers (e.g. NextAuth route).
      config.externals.push('@prisma/client', 'bcryptjs')
    }
    return config
  },
}

module.exports = nextConfig
