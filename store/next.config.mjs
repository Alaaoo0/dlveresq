/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // هذا السطر يمنع فشل البناء بسبب أخطاء ESLint
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
