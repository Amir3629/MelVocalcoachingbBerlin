/** @type {import('next').NextConfig} */

const nextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'i3.ytimg.com',
        pathname: '/vi/**',
      }
    ],
  },
  basePath: process.env.NODE_ENV === 'production' ? '/MelVocalcoachingBerlin' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/MelVocalcoachingBerlin/' : '',
  trailingSlash: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
      type: 'asset/resource',
    })
    return config
  },
  publicRuntimeConfig: {
    basePath: process.env.NODE_ENV === 'production' ? '/MelVocalcoachingBerlin' : '',
  },
  typescript: {
    // During build, ignore type checking errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // During build, ignore eslint errors
    ignoreDuringBuilds: true,
  },
  // Ensure all static files are copied correctly
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  }
}

module.exports = nextConfig
