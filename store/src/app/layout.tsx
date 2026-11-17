import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "../context/WishlistContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NotificationPopup from "../components/NotificationPopup";
import { prisma } from "@/lib/prisma";

export const instant = false;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ali-Boss | متجرك الأول",
  description: "أفضل المنتجات بأفضل الأسعار",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ali-Boss",
  },
};

export const viewport: Viewport = {
  themeColor: "#dc2626",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // 👈 عشان نمنع الزووم العشوائي على الموبايل
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let settings = await prisma.settings.findUnique({ where: { id: 'global' } });
  
  if (!settings) {
    settings = { 
      id: 'global', 
      siteName: 'Ali-Boss', 
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
    <html lang="ar" dir="rtl" className="overflow-x-hidden">
      <body className={`${inter.className} overflow-x-hidden w-full max-w-[100vw]`}>
        <CartProvider>
          <WishlistProvider>
            {/* 👈 ضفنا overflow-x-hidden هون كمان */}
            <div className="flex flex-col min-h-screen relative overflow-x-hidden w-full">
              <Navbar siteName={settings?.siteName || "Ali-Boss"} />
              <main className="flex-grow w-full overflow-x-hidden">{children}</main>
              <Footer 
                whatsapp={settings?.whatsapp || ""} 
                email={settings?.email || ""} 
                siteName={settings?.siteName || "Ali-Boss"} 
              />
              <NotificationPopup />
            </div>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
