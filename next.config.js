/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['source.unsplash.com'],
  },
  i18n: { locales: ['de'], defaultLocale: 'de' },
}

module.exports = nextConfig
