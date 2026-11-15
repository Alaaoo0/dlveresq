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
      .then(data => setUser(data.user));
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
        <Link href="/" className="text-2xl font-black text-red-600 tracking-tighter block cursor-pointer">{siteName}</Link>
        <form onSubmit={handleSearch} className="flex-1 max-w-xl flex">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ØgØ¨Ø­Ø« Ø¹Ù† Ù…Ù†ØªØ¬..." className="w-full border-2 border-red-600 rounded-l-full px-4 py-2 outline-none text-black text-sm" />
          <button type="submit" className="bg-red-600 text-white px-6 py-2 rounded-r-full font-bold hover:bg-red-700 transition-colors">Ø¨Ø­Ø«</button>
        </form>
        <div className="flex items-center gap-4">
          <Link href="/wishlist" className="relative flex items-center gap-1 text-gray-700 hover:text-red-600 transition-colors">
            <span className="text-2xl">âŒ</span>
            {mounted && totalWishlist > 0 && <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{totalWishlist}</span>}
          </Link>
          <Link href="/cart" className="relative flex items-center gap-1 text-gray-700 hover:text-red-600 transition-colors">
            <span className="text-2xl">ğŸ›ºÜÜ[‚ˆÛ[İ[Y	‰ˆİ[][\Èˆ	‰ˆÜ[ˆÛ\ÜÓ˜[YOH˜XœÛÛ]H]ÜLH\šYÚLˆ™Ë\™YMŒ^]Ú]H^^È›ÛX›ÛËMHMH›^][\ËXÙ[\ˆ\İYKXÙ[\ˆ›İ[™YY[İİ[][\ßOÜÜ[ŸBˆÓ[šÏ‚ˆ]ˆÛ\ÜÓ˜[YOH˜›Ü™\‹\ˆ‹M\‹Lˆ›^][\ËXÙ[\ˆØ\LÈ‚ˆÛ[İ[Y	‰ˆ\Ù\ˆÈ
ˆ]ˆÛ\ÜÓ˜[YOH™›^][\ËXÙ[\ˆØ\LÈ‚ˆÜ[ˆÛ\ÜÓ˜[YOH^\ÛH›ÛX›Û^YÜ˜^KN¶(öaöa6)ö#İ\Ù\‹›˜[Y_OÜÜ[‚ˆ]ÛˆÛÛXÚÏ^Ú[™SÙÛİ]HÛ\ÜÓ˜[YOH^\ÛH^\™YMŒİ™\[™\›[™H¶+¶,vb6+Ø]Û‚ˆÙ]‚ˆ
Hˆ
ˆ[šÈ™YH‹ÛÙÚ[ˆˆÛ\ÜÓ˜[YOH^\ÛH›ÛX›Û^YÜ˜^KMÌİ™\^\™YMŒ›^][\ËXÙ[\ˆØ\LH‚ˆÜ[ˆÛ\ÜÓ˜[YOH^^¼'äjOÜÜ[ˆ6+ö+¶b6aˆÓ[šÏ‚ˆ
_BˆÙ]‚ˆÙ]‚ˆÙ]‚ˆÚXY\‚ˆ
NÂŸ