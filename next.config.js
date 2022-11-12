/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images:{
    domains:["images.pexels.com","github.githubassets.com","tailwindui.com"]
  }
}

module.exports = nextConfig
