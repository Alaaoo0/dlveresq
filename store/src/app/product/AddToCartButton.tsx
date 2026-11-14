"use client";

import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();
    const [showToast, setShowToast] = useState(false);

      const handleAdd = () => {
          addToCart({
                id: product.id,
                      name: product.name,
                            price: product.price,
                                  imageUrl: product.imageUrl || "",
                                        quantity: 1,
                                            });
                                                
                                                    // إظهار الرسالة لمدة ثانيتين
                                                        setShowToast(true);
                                                            setTimeout(() => setShowToast(false), 2000);
                                                              };

                                                                return (
                                                                    <>
                                                                          <button
                                                                                  onClick={handleAdd}
                                                                                          className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors mt-6"
                                                                                                >
                                                                                                        أضف للسلة
                                                                                                              </button>

                                                                                                                    {/* الرسالة الأنيقة */}
                                                                                                                          {showToast && (
                                                                                                                                  <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 z-50 flex items-center gap-2">
                                                                                                                                            <span>✓</span>
                                                                                                                                                      <span>تمت إضافة المنتج للسلة</span>
                                                                                                                                                              </div>
                                                                                                                                                                    )}
                                                                                                                                                                        </>
                                                                                                                                                                          );
                                                                                                                                                                          }