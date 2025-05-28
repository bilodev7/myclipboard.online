/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites(a) {
    return [
      // API proxy
      {
        source: '/api/:path*',
        destination: 'http://backend:3001/api/:path*' // dockers network
      },
      // Socket.IO proxy
      // {
      //   source: '/socket.io',
      //   destination: 'http://backend:3001/' // dockers network
      // },
    ];
  },
  // // Ensure WebSocket connections are properly proxied
  // webpack: (config) => {
  //   config.externals = [...(config.externals || []), { 'socket.io-client': 'socket.io-client' }];
  //   return config;
  // },
};

module.exports = nextConfig;
