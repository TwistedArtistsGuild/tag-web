/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

if (process.env.NODE_ENV === 'development') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}
const localDevStartedAt = process.env.NODE_ENV === "development" ? new Date().toISOString() : ""

const nextConfig = {
  output: 'export', // Required for Capacitor static export
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_LOCAL_DEV_STARTED_AT: process.env.NEXT_PUBLIC_LOCAL_DEV_STARTED_AT || localDevStartedAt,
  },
  // Suppress hydration warnings in development
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  // Skip protected/admin/dynamic pages during static export for MVP mobile app
  exportPathMap: async (defaultPathMap, { dev, dir, outDir, distDir, buildId }) => {
    if (dev) return defaultPathMap; // Keep all pages in dev mode
    
    // Filter out: internal/auth/admin/dynamic pages
    const excludePaths = ['/test', '/portal', '/join', '/authenticate', '/orders', '/contests', '/events', '/user/orders', '/vendor', '/venue'];
    const excludePatterns = [/poster/, /api/];
    
    return Object.keys(defaultPathMap)
      .filter(key => {
        // Exclude if starts with excluded path
        if (excludePaths.some(path => key.startsWith(path))) return false;
        // Exclude if matches pattern
        if (excludePatterns.some(pattern => pattern.test(key))) return false;
        return true;
      })
      .reduce((acc, key) => {
        acc[key] = defaultPathMap[key];
        return acc;
      }, {});
  },
  images: {
    unoptimized: true, // Required for static export (Capacitor)
    // NextJS <Image> component needs to whitelist remote patterns for src{}
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tagpictures.blob.core.windows.net",
        port: "",
        pathname: "**",
      }, 
      {
        protocol: "https",
        hostname: "tagstatic.blob.core.windows.net",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "logos-world.net",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "vumbnail.com",
        port: "",
        pathname: "**",
      },
    ],
  },

  // ADDED: Fallback rewrites for clean proxying to .NET without prefixes
  async rewrites() {
    return {
      fallback: [
        {
          // proxy for API routes
          source: '/api/:path*',
          destination: `${process.env.DOTNET_API_URL || 'https://api.twistedartistsguild.com/api'}/:path*`,
        },
        {
          // proxy for SignalR WebSockets
          source: '/hubs/:path*',
          // Note: SignalR endpoints live at the root of .NET, not inside the /api/ folder controller route
          destination: `${process.env.DOTNET_API_URL ? process.env.DOTNET_API_URL.replace('/api', '') : 'https://api.twistedartistsguild.com'}/hubs/:path*`,
        },
      ],
    }
  },
};

module.exports = nextConfig;
