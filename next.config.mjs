/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "localhost",
      "gravatar.com",
      "2.gravatar.com",
      "xtcrjordvnddzvchmpvd.supabase.co",
      "*",
    ],
  },
};

export default nextConfig;
