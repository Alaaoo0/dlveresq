import type { Metadata, Viewport } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "../context/WishlistContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NotificationPopup from "../components/NotificationPopup";
import PWAInstaller from "../components/PWAInstaller";
import { prisma } from "@/lib/prisma";

// استخدام خط عربي احترافي (تجوال) بدلاً من Inter لدعم اللغة العربية بشكل ممتاز
const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "تسوق الآن",
  description: "أفضل المنتجات بأفضل الأسعار",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent", // يجعل شريط الحالة مدمجاً بشكل أجمل في iOS
    title: "تسوق الآن",
  },
  // ضمان ظهور الأيقونة عند إضافة الموقع للشاشة الرئيسية في iOS و Android
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#dc2626", // لون شريط الحالة العلوي في الهاتف
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // منع التكبير بالضغط المزدوج ليبدو كتطبيق أصلي (Native App)
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let settings;
  
  // استخدام try-catch لمنع انهيار الصفحة في حال وجود مشكلة مؤقتة في Prisma
  try {
    settings = await prisma.settings.findUnique({ where: { id: 'global' } });
  } catch (error) {
    console.error("فشل في جلب إعدادات الموقع:", error);
  }

  // قيم افتراضية آمنة في حال لم تكن الإعدادات موجودة في قاعدة البيانات
  if (!settings) {
    settings = { 
      id: 'global', 
      siteName: 'تسوق الآن', 
      heroTitle: '', 
      heroSubtitle: '', 
      heroBtnText: '', 
      discountBadge: '', 
      whatsapp: '96170000000', 
      whishNumber: '0000000',
      email: 'info@aliboss.com' 
    };
  }

  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} font-sans overflow-x-hidden`}>
      <body className="overflow-x-hidden w-full max-w-[100vw] bg-white text-gray-900 antialiased">
        {/* مكون تثبيت تطبيق الويب التقدمي */}
        <PWAInstaller />
        
        <CartProvider>
          <WishlistProvider>
            <div className="flex flex-col min-h-screen w-full">
              <Navbar siteName={settings.siteName} />
              
              <main className="flex-grow w-full">
                {children}
              </main>
              
              <Footer 
                whatsapp={settings.whatsapp} 
                email={settings.email} 
                siteName={settings.siteName} 
              />
              
              <NotificationPopup />
            </div>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
