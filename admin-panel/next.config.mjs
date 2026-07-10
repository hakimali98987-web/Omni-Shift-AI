/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Tool logos are admin-supplied URLs from arbitrary hosts.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
