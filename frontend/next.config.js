/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.sanity.io', 'localhost'],
  },
  distDir: './build',
}

module.exports = nextConfig
