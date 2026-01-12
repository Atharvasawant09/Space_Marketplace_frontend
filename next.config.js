/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',  // Allow ALL HTTPS domains
      },
      {
        protocol: 'http',
        hostname: '**',  // Allow ALL HTTP domains (for localhost)
      },
    ],
  },
}

module.exports = nextConfig
