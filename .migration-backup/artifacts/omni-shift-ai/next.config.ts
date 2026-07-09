import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Transpile TypeScript workspace packages so Next.js can bundle them
  transpilePackages: ['@workspace/api-client-react'],

  images: {
    // Allow external logo images (Clearbit, etc.) and disable optimisation
    // for maximum static-host compatibility
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'logo.clearbit.com' },
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;
