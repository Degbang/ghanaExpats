/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    authInterrupts: true
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-934ea8ca1c414fc6bb57081527cb3f4a.r2.dev",
        port: "",
        pathname: "/**"
      }
    ]
  }
};

export default nextConfig;
