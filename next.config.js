/** @type {import('next').NextConfig} */
const config = require('./config/config.json');
const prod = process.env.NODE_ENV === 'production'
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: prod ? config.deploy.repo.split('/').at(-1).split('.git').at(-2) : '',
}

module.exports = nextConfig
