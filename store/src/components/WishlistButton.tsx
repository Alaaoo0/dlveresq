"use client";
import { useWishlist } from "../context/WishlistContext";
import { useEffect, useState } from "react";

export function WishlistButton({ product }: { product: any }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
    const [mounted, setMounted] = useState(false);

      useEffect(() => setMounted(true), []);
        if (!mounted) return null;

          const isFav = isInWishlist(product.id);

            return (
                <button
                      onClick={() => toggleWishlist(product)}
                            className={`text-2xl transition-transform hover:scale-110 ${isFav ? 'text-red-500' : 'text-gray-300'}`}
                                >
                                      {isFav ? '❤️' : '🤍'}
                                          </button>
                                            );
                                            }