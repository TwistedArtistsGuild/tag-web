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
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_LOCAL_DEV_STARTED_AT: process.env.NEXT_PUBLIC_LOCAL_DEV_STARTED_AT || localDevStartedAt,
  },
  // Suppress hydration warnings in development
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  images: {
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
          // If a request starts with /api/...
          source: '/api/:path*',
          // ...and NextJS DOES NOT have a matching file in the `pages/api` folder,
          // Forward it directly and silently to the .NET Backend
          destination: `${process.env.DOTNET_API_URL || 'http://localhost:5000/api'}/:path*`,
        },
      ],
    }
  },
};

module.exports = nextConfig;
