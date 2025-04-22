/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
  // Add Vercel-specific configurations
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL
  },
  // Improve output
  output: 'standalone',
  // Add proper TypeScript checking during build
  typescript: {
    // Don't fail the build if there are TypeScript errors
    // Change to true when all errors are fixed
    ignoreBuildErrors: false,
  },
};

export default nextConfig;