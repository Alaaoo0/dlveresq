const nextConfig = {
  // تعطيل تحسين CSS التجريبي اللي بيسبب مشاكل أحياناً
  experimental: {
    optimizeCss: false,
  },
  // منع Next.js من محاولة بناء الصفحات الديناميكية أثناء الـ Build
  // هذا بيخلي الصفحات تتبنى أول ما الزبون يفتحها (On-demand)
  output: 'standalone', 
};

export default nextConfig;
