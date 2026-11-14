import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"; // استوردنا الفوتر

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ali-Boss | متجرك الأول",
    description: "أفضل المنتجات بأفضل الأسعار",
      manifest: "/manifest.json",
      };

      export default function RootLayout({
        children,
        }: {
          children: React.ReactNode;
          }) {
            return (
                <html lang="ar" dir="rtl">
                      <body className={inter.className}>
                              <CartProvider>
                                        <div className="flex flex-col min-h-screen">
                                                    <Navbar />
                                                                <main className="flex-grow">{children}</main>
                                                                            <Footer />
                                                                                      </div>
                                                                                              </CartProvider>
                                                                                                    </body>
                                                                                                        </html>
                                                                                                          );
                                                                                                          }