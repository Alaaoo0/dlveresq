import { prisma } from "@/lib/prisma";

export default async function AboutPage() {
  // ✅ جلب اسم المتجر من قاعدة البيانات
  const settings = await prisma.settings.findUnique({ where: { id: 'global' } });
  const siteName = settings?.siteName || "Ali-Boss";

  return (
    <main className="max-w-3xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-sm border border-gray-100" dir="rtl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">من نحن</h1>
      
      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          أهلاً بك في <strong>{siteName}</strong>، متجرك الأول والأفضل للتسوق الإلكتروني في لبنان. 
          تأسس متجرنا بهدف واحد: توفير أفضل المنتجات العالمية بأسعار تنافسية، مع خدمة توصيل سريعة وموثوقة لجميع المناطق اللبنانية.
        </p>
        <p>
          نحن نؤمن بأن التسوق عبر الإنترنت يجب أن يكون سهلاً، آمناً، وممتعاً. لذلك، نختار منتجاتنا بعناية فائقة لضمان الجودة العالية التي تستحقها.
        </p>
        
        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-2">لماذا تختار {siteName}؟</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>شحن سريع وآمن لجميع المناطق.</li>
          <li>الدفع عند الاستلام (لتكون مطمئناً 100%).</li>
          <li>خدمة عملاء جاهزة للرد على استفساراتك عبر الواتساب.</li>
          <li>سياسة استرجاع مرنة تضمن حقوقك.</li>
        </ul>
        
        <p className="mt-6 font-bold text-red-600">شكراً لثقتكم بنا، ونتمنى لكم تجربة تسوق رائعة!</p>
      </div>
    </main>
  );
}
