"use client";

import { useCart } from "../context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart() || {};
    const [quantity, setQuantity] = useState(1);
      const router = useRouter();

        const handleAdd = () => {
            if (addToCart) {
                  addToCart({ ...product, quantity });
                        router.push("/cart");
                            }
                              };

                                return (
                                    <div className="space-y-4">
                                          <div className="flex items-center gap-4">
                                                  {/* هون خليت الكلمة سوداء غامقة */}
                                                          <span className="text-sm font-bold text-gray-900">الكمية:</span>
                                                                  
                                                                          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                                                                                    {/* هون حطيت text-black للأزرار */}
                                                                                              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-lg font-bold text-black">-</button>
                                                                                                        
                                                                                                                  {/* وهون حطيت text-black للرقم */}
                                                                                                                            <span className="w-12 text-center font-bold text-lg text-black">{quantity}</span>
                                                                                                                                      
                                                                                                                                                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-lg font-bold text-black">+</button>
                                                                                                                                                        </div>
                                                                                                                                                              </div>

                                                                                                                                                                    <button
                                                                                                                                                                            onClick={handleAdd}
                                                                                                                                                                                    className="w-full bg-red-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
                                                                                                                                                                                          >
                                                                                                                                                                                                  <span>🛒</span> أضف للسلة
                                                                                                                                                                                                        </button>
                                                                                                                                                                                                            </div>
                                                                                                                                                                                                              );
                                                                                                                                                                                                              }