import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "توصيل سريع | أسرع خدمة توصيل",
  description: "أطلب منتجاتك المفضلة وتوصلك لباب بيتك بأسرع وقت وأفضل سعر.",
  manifest: "/manifest.json", // إذا كان لديك ملف PWA
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "توصيل سريع",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563EB", // لون الشريط العلوي بالموبايل (الأزرق الجديد)
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* ✅ إضافة خط Tajawal بشكل صحيح لتجنب أخطاء CSS */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased bg-[var(--background)] text-[var(--text-main)]">
        {/* هنا سيتم تحميل جميع الصفحات والمكونات */}
        {children}
      </body>
    </html>
  );
}
