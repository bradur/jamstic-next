/** @type {import('next').NextConfig} */
const withOptimizedImages = require('next-optimized-images');
const config = require('./config/config.json')

const repo = config.deploy.repo
const splitRepo = repo.split('/')
const repoName = splitRepo.length > 0 ? splitRepo.at(-1) ?? repo : repo
const splitGit = repoName.split('.git')
const finalRepoName = splitGit.length > 1 ? splitGit.at(-2) : repoName
const prod = process.env.NODE_ENV === 'production'

process.env.NEXT_PUBLIC_BASE_PATH = prod ? `/${finalRepoName}` : ''


const nextConfig = withOptimizedImages({
  reactStrictMode: true,
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  trailingSlash: true,
})

module.exports = nextConfig
