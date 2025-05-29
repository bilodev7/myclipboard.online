/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://docker0.local:3001/api/:path*' // my internal docker network. bad practice but it works
      },
    ];
  },
};

module.exports = nextConfig;