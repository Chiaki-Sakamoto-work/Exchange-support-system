export const dynamic = 'force-dynamic'; // Vercelのキャッシュバグを防止

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/';

  if (!code) {
    return NextResponse.redirect(
      new URL('/login?error=missing-code', requestUrl.origin),
    );
  }

  const cookieStore = await cookies();

  // 💡 【追加】Docker内部通信用の環境変数を取得
  const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const internalUrl = process.env.SUPABASE_INTERNAL_URL || publicUrl;

  const supabase = createServerClient(
    publicUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      // 💡 【追加】ミドルウェアと同様、Docker内部のコンテナ間通信のためにfetchをリライト
      global: {
        fetch: (url, options) =>
          fetch(url.toString().replace(publicUrl, internalUrl), options),
      },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (_error) {
            // Server Component用のエラーは無視
          }
        },
      },
    },
  );

  // 本物のSupabase（ローカルの場合はDockerのKong）に対してセッション交換を実行
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (!error) {
    return NextResponse.redirect(new URL(next, requestUrl.origin));
  }

  console.error('❌ Supabase Auth Error:', error.message);
  return NextResponse.redirect(
    new URL('/login?error=auth-callback-failed', requestUrl.origin),
  );
}
