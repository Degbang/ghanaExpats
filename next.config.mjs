/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    authInterrupts: true
  },
  images: {
    formats: ["image/avif", "image/webp"]
  }
};

export default nextConfig;
