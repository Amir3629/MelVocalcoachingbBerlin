/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  output: 'export',
  distDir: 'out',
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
  basePath: '/MelVocalcoachingbBerlin',
  assetPrefix: '/MelVocalcoachingbBerlin/',
  trailingSlash: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
      type: 'asset/resource',
    })
    return config
  },
  publicRuntimeConfig: {
    basePath: '/MelVocalcoachingbBerlin',
  },
  // Exclude backup and temporary directories from build
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'].filter(ext => 
    !ext.includes('backup') && !ext.includes('bak')
  ),
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  }
}

module.exports = nextConfig
