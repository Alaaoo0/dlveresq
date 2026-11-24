import Link from "next/link";

export default function AdminDashboard() {
  // بيانات وهمية للإحصائيات (لاحقاً نجيبها من الـ API)
  const stats = [
    { 
      title: "إجمالي الطلبات", 
      value: "1,248", 
      change: "+12%", 
      isPositive: true, 
      icon: "📦", 
      color: "bg-blue-50 text-blue-600 border-blue-100" 
    },
    { 
      title: "الإيرادات اليوم", 
      value: "$3,450", 
      change: "+8%", 
      isPositive: true, 
      icon: "💰", 
      color: "bg-green-50 text-green-600 border-green-100" 
    },
    { 
      title: "السائقين المتاحين", 
      value: "18", 
      change: "-2", 
      isPositive: false, 
      icon: "🏍️", 
      color: "bg-purple-50 text-purple-600 border-purple-100" 
    },
    { 
      title: "طلبات قيد الانتظار", 
      value: "7", 
      change: "عاجل", 
      isPositive: false, 
      icon: "⏳", 
      color: "bg-orange-50 text-orange-600 border-orange-100" 
    },
  ];

  const recentOrders = [
    { id: "#ORD-8821", customer: "أحمد محمد", status: "تم التسليم", price: "$15.00", time: "منذ 5 دقائق" },
    { id: "#ORD-8820", customer: "سارة علي", status: "جاري التوصيل", price: "$22.50", time: "منذ 12 دقيقة" },
    { id: "#ORD-8819", customer: "يوسف حسن", status: "قيد التحضير", price: "$8.00", time: "منذ 20 دقيقة" },
    { id: "#ORD-8818", customer: "نور الدين", status: "جديد", price: "$45.00", time: "منذ 25 دقيقة" },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] p-6 md:p-10" dir="rtl">
      
      {/* 1. الهيدر والترحيب */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-main)]">لوحة التحكم</h1>
          <p className="text-[var(--text-muted)] mt-1">مرحباً بك، إليك ملخص أداء المتجر اليوم</p>
        </div>
        
        <div className="flex gap-3">
          <Link href="/admin/employees" className="btn-primary flex items-center gap-2 !py-2.5 !px-5">
            <span>👥</span> إدارة الموظفين
          </Link>
          <Link href="/admin/orders" className="bg-white border border-gray-200 text-[var(--text-main)] font-bold py-2.5 px-5 rounded-[1rem] hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
            <span>📋</span> كل الطلبات
          </Link>
        </div>
      </header>

      {/* 2. بطاقات الإحصائيات السريعة */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className={`card-modern !p-6 border ${stat.color.replace('text-', 'border-').split(' ')[2]} relative overflow-hidden group`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color.split(' ')[0]} ${stat.color.split(' ')[1]} flex items-center justify-center text-2xl shadow-sm`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                stat.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {stat.change}
              </span>
            </div>
            
            <h3 className="text-3xl font-black text-[var(--text-main)] mb-1">{stat.value}</h3>
            <p className="text-sm font-medium text-[var(--text-muted)]">{stat.title}</p>
            
            {/* تأثير زخرفي خفيف عند التحويم */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-current opacity-5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
          </div>
        ))}
      </div>

      {/* 3. جدول الطلبات الأخيرة */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-[var(--text-main)] flex items-center gap-2">
            <span>🕒</span> آخر الطلبات الواردة
          </h2>
          <Link href="/admin/orders" className="text-sm font-bold text-[var(--primary)] hover:underline">
            عرض الكل ←
          </Link>
        </div>

        <div className="card-modern !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="py-4 px-6 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">رقم الطلب</th>
                  <th className="py-4 px-6 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">الزبون</th>
                  <th className="py-4 px-6 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">الحالة</th>
                  <th className="py-4 px-6 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">المبلغ</th>
                  <th className="py-4 px-6 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">الوقت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                    <td className="py-4 px-6 font-mono font-bold text-[var(--primary)]">{order.id}</td>
                    <td className="py-4 px-6 font-medium text-[var(--text-main)]">{order.customer}</td>
                    <td className="py-4 px-6">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        order.status === 'تم التسليم' ? 'bg-green-100 text-green-700' :
                        order.status === 'جاري التوصيل' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'قيد التحضير' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-black text-[var(--text-main)]">{order.price}</td>
                    <td className="py-4 px-6 text-sm text-[var(--text-muted)]">{order.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
}
