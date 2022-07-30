/** @type {import('next').NextConfig} */
const config = require('./config/config.json');
const prod = process.env.NODE_ENV === 'production'

const withOptimizedImages = require('next-optimized-images');

const nextConfig = withOptimizedImages({
  reactStrictMode: true,
  assetPrefix: prod ? config.deploy.repo.split('/').at(-1).split('.git').at(-2) : '',
  trailingSlash: true,
})

module.exports = nextConfig
