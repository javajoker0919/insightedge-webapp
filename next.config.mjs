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
      "young-wonder-ac90143803.media.strapiapp.com"
    ],
  },
};

export default nextConfig;
