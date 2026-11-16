"use client";
import { useState } from "react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

      const handleLogin = async (e: React.FormEvent) => {
          e.preventDefault();
              const res = await fetch("/api/admin/login", {
                    method: "POST",
                          headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ password }),
                                    });
                                        if (res.ok) {
                                              // هون السر: تحديث كامل للصفحة عشان الكوكي تنحفظ
                                                    window.location.href = "/admin"; 
                                                        } else {
                                                              setError(true);
                                                                  }
                                                                    };

                                                                      return (
                                                                          <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
                                                                                <div className="bg-white p-8 rounded-xl shadow-md w-96 border border-gray-100">
                                                                                        <h1 className="text-2xl font-bold text-red-600 mb-6 text-center">دخول الإدارة</h1>
                                                                                                <form onSubmit={handleLogin} className="space-y-4">
                                                                                                          <input
                                                                                                                      type="password"
                                                                                                                                  value={password}
                                                                                                                                              onChange={(e) => setPassword(e.target.value)}
                                                                                                                                                          placeholder="أدخل كلمة المرور"
                                                                                                                                                                      className="w-full border p-3 rounded-lg text-black"
                                                                                                                                                                                  required
                                                                                                                                                                                            />
                                                                                                                                                                                                      {error && <p className="text-red-500 text-sm">كلمة المرور غلط!</p>}
                                                                                                                                                                                                                <button type="submit" className="w-full bg-black text-white p-3 rounded-lg font-bold hover:bg-gray-800">
                                                                                                                                                                                                                            دخول
                                                                                                                                                                                                                                      </button>
                                                                                                                                                                                                                                              </form>
                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                          );
                                                                                                                                                                                                                                                          }