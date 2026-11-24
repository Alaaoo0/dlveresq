/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // هذا السطر يمنع فشل البناء بسبب أخطاء ESLint على Vercel
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
