/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://spring_backend:8080/api/:path*',
      },
    ];
  },
  webpack: (config) => {
    const CopyPlugin = require('copy-webpack-plugin');
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: 'node_modules/monaco-editor/min/vs',
            to: 'static/monaco/vs',
          },
        ],
      })
    );
    return config;
  },
};

module.exports = nextConfig;
