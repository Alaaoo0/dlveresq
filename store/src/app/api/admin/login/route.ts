import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const { password } = await req.json();
    const adminPassword = process.env.ADMIN_PASSWORD || "BossMan2026!";

      if (password === adminPassword) {
          const cookieStore = await cookies();
              cookieStore.set('admin_session', 'true', {
                    httpOnly: true,
                          secure: process.env.NODE_ENV === 'production',
                                maxAge: 60 * 60 * 24 * 7, // أسبوع
                                      path: '/',
                                          });
                                              return NextResponse.json({ success: true });
                                                }
                                                  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
                                                  }