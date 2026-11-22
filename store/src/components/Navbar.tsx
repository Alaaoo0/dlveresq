"use client";

import Link from "next/link";
import { useCart } from "../app/context/CartContext";
import { useState, useEffect } from "react";

export default function Navbar({ siteName = "توصيل سريع" }: { siteName?: string }) {
  const { cart = [] } = useCart() || {};
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setUser(data.user || null))
      .catch(() => setUser(null));
  }, []);

  const cartCount = cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black text-red-600">
          {siteName}
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-gray-700 hover:text-red-600 font-bold flex items-center gap-1">
            🏠 الرئيسية
          </Link>
          <Link href="/offers" className="text-gray-700 hover:text-red-600 font-bold flex items-center gap-1">
            🎁 العروض
          </Link>
          <Link href="/products" className="text-gray-700 hover:text-red-600 font-bold flex items-center gap-1">
            🛍️ المتجر
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/wallet" className="hidden sm:flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                💳 ${user.walletBalance?.toFixed(2) || "0.00"}
              </Link>
              <button onClick={handleLogout} className="hidden sm:block text-sm text-red-600 font-bold hover:underline">
                خروج
              </button>
            </>
          ) : (
            <Link href="/login" className="hidden sm:flex items-center gap-1 text-gray-700 hover:text-red-600 font-bold">
              👤 دخول
            </Link>
          )}

          <Link href="/cart" className="relative text-gray-700 hover:text-red-600 text-2xl">
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          <Link href="/wishlist" className="relative text-gray-700 hover:text-red-600 text-2xl">
            ❤️
          </Link>

          <Link href="/orders" className="text-gray-700 hover:text-red-600 text-2xl">
            🔔
          </Link>

          <Link href="/admin" className="text-gray-700 hover:text-red-600 text-2xl">
            ⚙️
          </Link>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-2xl text-gray-700">
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-3">
          <Link href="/" onClick={() => setMenuOpen(false)} className="block text-gray-700 hover:text-red-600 font-bold">🏠 الرئيسية</Link>
          <Link href="/offers" onClick={() => setMenuOpen(false)} className="block text-gray-700 hover:text-red-600 font-bold">🎁 العروض</Link>
          <Link href="/products" onClick={() => setMenuOpen(false)} className="block text-gray-700 hover:text-red-600 font-bold">🛍️ المتجر</Link>
          {user ? (
            <>
              <Link href="/wallet" onClick={() => setMenuOpen(false)} className="block text-green-700 font-bold">💳 المحفظة: ${user.walletBalance?.toFixed(2)}</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="block text-red-600 font-bold">خروج</button>
            </>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)} className="block text-gray-700 font-bold">👤 دخول</Link>
          )}
        </div>
      )}
    </header>
  );
}
