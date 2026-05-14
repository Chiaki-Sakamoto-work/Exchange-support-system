import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export async function updateSession(request: NextRequest) {
  const supabaseUrl =
    process.env.SUPABASE_INTERNAL_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // ブラウザがアクセス可能なURLを定義
  const PublicUrl = process.env.NEXT_PROG_URL || process.env.FRONTEND;

  let supabaseResponse = NextResponse.next({
    request,
  });

  // 1. 環境変数チェック（ログの場所を修正）
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('⚠️ Missing Supabase environment variables');
    return supabaseResponse;
  }

  // 2. Supabase クライアント作成
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  // 3. ユーザー取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();

  // 4. 除外設定
  const isAuthPage =
    url.pathname.startsWith('/login') || url.pathname === '/callback';
  if (isAuthPage) {
    return supabaseResponse;
  }

  // 5. 未ログイン時のガード（リダイレクト先を PUBLIC_URL に固定）
  if (!user) {
    // 🔴 request.url ではなく、明示的に localhost:3000 を指定してリダイレクト
    return NextResponse.redirect(new URL('/login', PublicUrl));
  }

  // 6. ログイン済みで /login にアクセスした場合
  if (user && url.pathname === '/login') {
    return NextResponse.redirect(new URL('/', PublicUrl));
  }

  return supabaseResponse;
}
