"use client";
import Link from "next/link";
import { useCart } from "../app/context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar({ siteName }: { siteName: string }) {
  const { cart = [] } = useCart() || {};
    const { wishlist = [] } = useWishlist() || {};
      const [mounted, setMounted] = useState(false);
        const [searchQuery, setSearchQuery] = useState("");
          const [user, setUser] = useState<any>(null);
            const router = useRouter();
              
                useEffect(() => {
                    setMounted(true);
                        fetch("/api/auth/me", { cache: 'no-store' })
                              .then(res => res.json())
                                    .then(data => setUser(data.user))
                                          .catch(() => setUser(null));
                                            }, []);

                                              const totalItems = cart.reduce((total: number, item: any) => total + item.quantity, 0);
                                                const totalWishlist = wishlist.length;

                                                  const handleSearch = (e: React.FormEvent) => {
                                                      e.preventDefault();
                                                          if (searchQuery.trim()) router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                                                            };

                                                              const handleLogout = async () => {
                                                                  await fetch("/api/auth/logout", { method: "POST" });
                                                                      setUser(null); 
                                                                          window.location.href = "/"; 
                                                                            };

                                                                              return (
                                                                                  <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
                                                                                        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                                                                                                
                                                                                                        <Link href="/" className="text-2xl font-black text-red-600 tracking-tighter block cursor-pointer transition-transform duration-300 hover:scale-105">
                                                                                                                  {siteName}
                                                                                                                          </Link>
                                                                                                                                  
                                                                                                                                          <form onSubmit={handleSearch} className="flex-1 max-w-xl flex">
                                                                                                                                                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ابحث عن منتج..." className="w-full border-2 border-red-600 rounded-l-full px-4 py-2 outline-none text-black text-sm" />
                                                                                                                                                              <button type="submit" className="bg-red-600 text-white px-6 py-2 rounded-r-full font-bold hover:bg-red-700 transition-colors">بحث</button>
                                                                                                                                                                      </form>

                                                                                                                                                                              <div className="flex items-center gap-4">
                                                                                                                                                                                        <Link href="/wishlist" className="relative flex items-center gap-1 text-gray-700 hover:text-red-600 transition-colors">
                                                                                                                                                                                                    <span className="text-2xl">❤️</span>
                                                                                                                                                                                                                {mounted && totalWishlist > 0 && <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{totalWishlist}</span>}
                                                                                                                                                                                                                          </Link>
                                                                                                                                                                                                                                    <Link href="/cart" className="relative flex items-center gap-1 text-gray-700 hover:text-red-600 transition-colors">
                                                                                                                                                                                                                                                <span className="text-2xl">🛒</span>
                                                                                                                                                                                                                                                            {mounted && totalItems > 0 && <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{totalItems}</span>}
                                                                                                                                                                                                                                                                      </Link>

                                                                                                                                                                                                                                                                                <div className="border-r pr-4 mr-2 flex items-center gap-3">
                                                                                                                                                                                                                                                                                            {mounted && user ? (
                                                                                                                                                                                                                                                                                                          <div className="flex items-center gap-3">
                                                                                                                                                                                                                                                                                                                          {/* رابط طلباتي */}
                                                                                                                                                                                                                                                                                                                                          <Link href="/orders" className="text-sm font-bold text-gray-700 hover:text-red-600 hidden sm:block">طلباتي</Link>
                                                                                                                                                                                                                                                                                                                                                          
                                                                                                                                                                                                                                                                                                                                                                          <span className="text-sm font-bold text-gray-800">أهلاً، {user.name}</span>
                                                                                                                                                                                                                                                                                                                                                                                          <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">خروج</button>
                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                    ) : (
                                                                                                                                                                                                                                                                                                                                                                                                                                  <Link href="/login" className="text-sm font-bold text-gray-700 hover:text-red-600 flex items-center gap-1">
                                                                                                                                                                                                                                                                                                                                                                                                                                                  <span className="text-xl">👤</span> دخول
                                                                                                                                                                                                                                                                                                                                                                                                                                                                </Link>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            )}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </header>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          );
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          }