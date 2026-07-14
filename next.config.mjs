/** @type {import('next').NextConfig} */

const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=(), usb=()',
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'unsafe-none',
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://partner.googleadservices.com https://tpc.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com https://adservice.google.com https://fundingchoicesmessages.google.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com https://fundingchoicesmessages.google.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google; connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://adservice.google.com https://fundingchoicesmessages.google.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://cdnjs.cloudflare.com; worker-src 'self' blob: https://cdnjs.cloudflare.com; object-src 'none'; base-uri 'none'",
  },
];

const nextConfig = {
  trailingSlash: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/blog/needle-guide-guide',
        destination: '/needle-guide',
        permanent: true,
      },
      {
        source: '/blog/needle-converter-guide',
        destination: '/needle-guide',
        permanent: true,
      },
      {
        source: '/blog/abbreviation-glossary-guide',
        destination: '/abbreviation-glossary',
        permanent: true,
      },
      {
        source: '/blog/yarn-calculator-guide',
        destination: '/yarn-calculator',
        permanent: true,
      },
      {
        source: '/blog/cross-stitch-calculator-guide',
        destination: '/cross-stitch-calculator',
        permanent: true,
      },
      {
        source: '/blog/stitch-quick-reference-guide',
        destination: '/stitch-quick-reference',
        permanent: true,
      },
      {
        source: '/blog/stitch-pattern-calculator-guide',
        destination: '/stitch-pattern-calculator',
        permanent: true,
      },
      {
        source: '/blog/uk-to-us-converter-guide',
        destination: '/uk-to-us-converter',
        permanent: true,
      },
      {
        source: '/blog/how-many-yards-to-make-a-blanket',
        destination: '/blanket-calculator',
        permanent: true,
      },
      {
        source: '/blog/best-yarn-for-baby-blanket',
        destination: '/best-yarn-for-blankets',
        permanent: true,
      },
      {
        source: '/blog/:path*',
        destination: '/guides',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
