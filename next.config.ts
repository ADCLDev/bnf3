// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        pathname: '/**',
      },
    ],
  },
  // Other config options can be added here
};

export default nextConfig;