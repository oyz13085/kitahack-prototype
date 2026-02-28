/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // This helps Vercel's internal routing for monorepos
  distDir: '.next',
}

export default nextConfig;