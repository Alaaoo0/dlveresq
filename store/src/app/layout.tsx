import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "../context/WishlistContext"; // هون صلحنا المسار
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "متجري الإلكتروني",
    description: "أفضل المنتجات بأفضل الأسعار",
    };

    export default async function RootLayout({ children }: { children: React.ReactNode }) {
      let settings = await prisma.settings.findUnique({ where: { id: 'global' } });
        if (!settings) settings = { id: 'global', siteName: 'Ali-Boss', heroTitle: '', heroSubtitle: '', heroBtnText: '', discountBadge: '', whatsapp: '96170000000', email: 'info@aliboss.com' };

          return (
              <html lang="ar" dir="rtl">
                    <body className={inter.className}>
                            <CartProvider>
                                      <WishlistProvider>
                                                  <div className="flex flex-col min-h-screen">
                                                                <Navbar siteName={settings.siteName} />
                                                                              <main className="flex-grow">{children}</main>
                                                                                            <Footer whatsapp={settings.whatsapp} email={settings.email} siteName={settings.siteName} />
                                                                                                        </div>
                                                                                                                  </WishlistProvider>
                                                                                                                          </CartProvider>
                                                                                                                                </body>
                                                                                                                                    </html>
                                                                                                                                      );
                                                                                                                                      }