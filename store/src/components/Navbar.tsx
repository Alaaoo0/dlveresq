"use client";

import Link from "next/link";
import { useCart } from "../app/context/CartContext";

export default function Navbar() {
  const { cart = [] } = useCart() || {};
    // هون صلحنا الخطأ: ضفنا : number و : any
      const totalItems = cart.reduce((total: number, item: any) => total + item.quantity, 0);

        return (
            <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
                  <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                          
                                  {/* اللوجو */}
                                          <Link href="/" className="text-2xl font-black text-red-600 tracking-tighter hidden sm:block">
                                                    Ali-Boss
                                                            </Link>

                                                                    {/* شريط البحث */}
                                                                            <div className="flex-1 max-w-2xl flex">
                                                                                      <input 
                                                                                                  type="text" 
                                                                                                              placeholder="ابحث عن منتج..." 
                                                                                                                          className="w-full border-2 border-red-600 rounded-l-full px-4 py-2 outline-none text-black text-sm"
                                                                                                                                    />
                                                                                                                                              <button className="bg-red-600 text-white px-6 py-2 rounded-r-full font-bold hover:bg-red-700 transition-colors">
                                                                                                                                                          بحث
                                                                                                                                                                    </button>
                                                                                                                                                                            </div>

                                                                                                                                                                                    {/* السلة */}
                                                                                                                                                                                            <Link href="/cart" className="relative flex items-center gap-1 text-gray-700 hover:text-red-600 transition-colors">
                                                                                                                                                                                                      <span className="text-2xl">🛒</span>
                                                                                                                                                                                                                <span className="hidden sm:block font-bold">السلة</span>
                                                                                                                                                                                                                          {totalItems > 0 && (
                                                                                                                                                                                                                                      <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                                                                                                                                                                                                                                    {totalItems}
                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                          )}
                                                                                                                                                                                                                                                                                  </Link>
                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                            </header>
                                                                                                                                                                                                                                                                                              );
                                                                                                                                                                                                                                                                                              }