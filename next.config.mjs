/** @type {import('next').NextConfig} */
const config = {
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
  reactStrictMode: true,
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.vercel.com",
      },
      {
        protocol: "https",
        hostname: "**.githubusercontent.com",
      },
    ],
  },
};

export default config;
