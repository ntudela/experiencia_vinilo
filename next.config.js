/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'is*.mzstatic.com', pathname: '/image/**' },
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'https', hostname: 'is*.phoncdn.com', pathname: '/**' }
    ]
  }
}
module.exports = nextConfig;
