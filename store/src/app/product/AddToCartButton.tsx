"use client";

import { useCart } from "../context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ product, variants }: { product: any, variants: string | null }) {
  const { addToCart } = useCart() || {};
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState("");
  const router = useRouter();

  const isOutOfStock = product.stock <= 0;
  const variantList = variants ? variants.split(',').map(v => v.trim()).filter(Boolean) : [];

  const handleAdd = () => {
    if (isOutOfStock) return;
    
    if (variantList.length > 0 && !selectedVariant) {
      return alert("الرجاء اختيار الخيار المناسب أولاً.");
    }

    if (addToCart) {
      addToCart({ ...product, quantity, variant: selectedVariant });
      router.push("/cart");
    }
  };

  return (
    <div className="space-y-4">
      {!isOutOfStock && (
        <>
          {variantList.length > 0 && (
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">اختر الخيار:</label>
              <select 
                value={selectedVariant} 
                onChange={(e) => setSelectedVariant(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg p-3 text-black focus:border-red-500 outline-none cursor-pointer"
              >
                <option value="">-- اختر --</option>
                {variantList.map((v, i) => (
                  <option key={i} value={v}>{v}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-gray-900">الكمية:</span>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-lg font-bold text-black">-</button>
              <span className="w-12 text-center font-bold text-lg text-black">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-lg font-bold text-black">+</button>
            </div>
          </div>
        </>
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
        {isOutOfStock ? 'نفدت الكمية' : <><span>🛒</span> أضف للسلة</>}
      </button>
    </div>
  );
}