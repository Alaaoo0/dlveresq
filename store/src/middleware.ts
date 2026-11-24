export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/",              // الصفحة الرئيسية محمية
    "/products/:path*", // كل صفحات المنتجات محمية
    "/cart",          // السلة محمية
    "/checkout",      // الدفع محمي
    "/profile",       // البروفايل محمي
    // استثناءات: الصفحات المسموح للجميع بدخولها
    "/((?!api|_next/static|_next/image|favicon.ico|login|register|admin|employee).*)",
  ],
};
