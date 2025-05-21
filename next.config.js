// @ts-check
/**
 * Next.js configuration file for Next.js 15
 * Updated to remove deprecated options and fix configuration issues
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
        pathname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Enhanced performance options
  serverExternalPackages: [],
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["lucide-react", "framer-motion", "@headlessui/react"],
    scrollRestoration: true,
    workerThreads: true,
    webVitalsAttribution: ["CLS", "LCP"],
  },
  // Compress HTML and static assets
  compress: true,
  // Disable "Powered by Next.js" header
  poweredByHeader: false,
};

// Export the configuration
module.exports = nextConfig;
