"use client";

import { useCart } from "../context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart() || {};
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const isOutOfStock = product.stock <= 0;

  const handleAdd = () => {
    if (isOutOfStock) return;
    if (addToCart) {
      addToCart({ ...product, quantity });
      router.push("/cart");
    }
  };

  return (
    <div className="space-y-4">
      {!isOutOfStock && (
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-gray-900">الكمية:</span>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-lg font-bold text-black">-</button>
            <span className="w-12 text-center font-bold text-lg text-black">{quantity}</span>
            <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-lg font-bold text-black">+</button>
          </div>
        </div>
      )}

      <button
        onClick={handleAdd}
        disabled={isOutOfStock}
        className={`w-full font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg ${
          isOutOfStock 
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' 
          : 'bg-red-600 text-white hover:bg-red-700 shadow-red-600/30'
        }`}
      >
        {isOutOfStock ? (
          'نفدت الكمية'
        ) : (
          <><span>🛒</span> أضف للسلة</>
        )}
      </button>
    </div>
  );
}
