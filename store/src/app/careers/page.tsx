import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CareersPage() {
  const employees = await prisma.employee.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 mb-3">🤝 انضم لفريقنا</h1>
          <p className="text-gray-600 text-lg">تعرف على فريق العمل ووظائفنا المتاحة</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-r-4 border-red-500">
          <h2 className="text-2xl font-bold mb-4">لماذا تعمل معنا؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-xl"><div className="text-3xl mb-2">💰</div><h3 className="font-bold">رواتب مجزية</h3></div>
            <div className="text-center p-4 bg-red-50 rounded-xl"><div className="text-3xl mb-2">⏰</div><h3 className="font-bold">دوام مرن</h3></div>
            <div className="text-center p-4 bg-red-50 rounded-xl"><div className="text-3xl mb-2">📈</div><h3 className="font-bold">فرص نمو</h3></div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">فريق العمل الحالي</h2>
        <div className="space-y-4">
          {employees.map((emp) => (
            <div key={emp.id} className="bg-white rounded-xl shadow-sm border p-5 flex justify-between items-center flex-wrap gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{emp.name}</h3>
                <p className="text-gray-600">💼 {emp.position}</p>
                {emp.address && <p className="text-gray-500 text-sm">📍 {emp.address}</p>}
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${emp.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {emp.isAvailable ? '✅ متاح للتوظيف' : '❌ غير متاح'}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/" className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 inline-block">
            ← العودة للمتجر
          </Link>
        </div>
      </div>
    </div>
  );
}
