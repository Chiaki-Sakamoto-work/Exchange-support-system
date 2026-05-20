export const dynamic = 'force-dynamic'; // Vercelのキャッシュバグを防止

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing-code', requestUrl.origin));
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            // 💡 Next.js 15の正攻法：cookieStoreに直接セットしてブラウザに同期させる
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // Server Component用のエラーは無視
          }
        },
      },
    }
  );

  // 本物のSupabase Cloudに対してセッション交換を実行
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (!error) {
    // 🎉 成功！クッキーを持った状態でリダイレクト
    return NextResponse.redirect(new URL(next, requestUrl.origin));
  }

  console.error('❌ Supabase Auth Error:', error.message);
  return NextResponse.redirect(new URL('/login?error=auth-callback-failed', requestUrl.origin));
}

