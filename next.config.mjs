/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  async redirects() {
    return [
      {
        source: "/blog/needle-guide-guide",
        destination: "/needle-guide",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
