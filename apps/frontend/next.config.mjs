/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    PUBLIC_SOCKET_URL: process.env.PUBLIC_SOCKET_URL
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.DOCKER_BACKEND_URL + "/api/:path*" || 'http://backend:3001/api/:path*' // Using the service name from docker-compose
      },
    ];
  },
};

export default nextConfig;