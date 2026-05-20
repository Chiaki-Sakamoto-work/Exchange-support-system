

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/';

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing-code', requestUrl.origin));
  }

  const cookieStore = await cookies();
  
  // 💡 【超重要】先にリダイレクト用のレスポンスを作る！
  const response = NextResponse.redirect(new URL(next, requestUrl.origin));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // 💡 ブラウザに返す response に直接クッキーをねじ込む！（Linterエラーも回避）
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // 本物のSupabase Cloudに対してセッション交換を実行
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (!error) {
    // 🎉 クッキーがガチガチに焼き付いたレスポンスをブラウザに返す！
    return response;
  }

  console.error('❌ Supabase Auth Error:', error.message);
  return NextResponse.redirect(new URL('/login?error=auth-callback-failed', requestUrl.origin));
}
