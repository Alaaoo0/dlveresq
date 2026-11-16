import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
      const { password } = await req.json();
          
              // هون حطينا كلمة السر ثابتة عشان نتأكد إنها شغالة
                  const adminPassword = "alaao0"; 

                      if (password === adminPassword) {
                            const response = NextResponse.json({ success: true });
                                  
                                        response.cookies.set('admin_session', 'true', {
                                                httpOnly: true,
                                                        secure: process.env.NODE_ENV === 'production',
                                                                maxAge: 60 * 60 * 24 * 7,
                                                                        path: '/',
                                                                              });
                                                                                    
                                                                                          return response;
                                                                                              }
                                                                                                  return NextResponse.json({ message: 'كلمة المرور غلط' }, { status: 401 });
                                                                                                    } catch (error) {
                                                                                                        return NextResponse.json({ message: 'خطأ في السيرفر' }, { status: 500 });
                                                                                                          }
                                                                                                          }