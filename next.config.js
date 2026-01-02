/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  transpilePackages: ['jose'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    // Fix for jose package exports
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
    }
    return config
  },
}

module.exports = nextConfig

