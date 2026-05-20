import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export async function updateSession(request: NextRequest) {
  // クッキー名はブラウザが使う公開URLから生成されるため NEXT_PUBLIC_SUPABASE_URL を使う
  const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // 実際のAPIリクエストはDocker内部から到達できるURLへリライトする
  const internalUrl = process.env.VERCEL
    ? publicUrl
    : process.env.SUPABASE_INTERNAL_URL || publicUrl;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 💡 【修正】環境変数に頼らず、今アクセスされているURLから「https://xxx.vercel.app」を自動取得！
  const origin = request.nextUrl.origin;

  let supabaseResponse = NextResponse.next({
    request,
  });

  // 1. 環境変数チェック
  if (!publicUrl || !supabaseAnonKey) {
    console.error('⚠️ Missing Supabase environment variables');
    return supabaseResponse;
  }

  // 2. Supabase クライアント作成
  const supabase = createServerClient(publicUrl, supabaseAnonKey, {
    // 💡 【修正①】Vercel上（process.env.VERCELがある時）は、Docker用のfetch書き換えを「丸ごと無効化」する
    ...(process.env.VERCEL
      ? {}
      : {
          global: {
            fetch: (url, options) =>
              fetch(
                url.toString().replace(publicUrl, internalUrl ?? ''),
                options,
              ),
          },
        }),
    cookies: {
      getAll() {
        // 💡 【修正②】公式推奨の安全な形（nameとvalueだけ）に綺麗にマッピングして返す
        return request.cookies
          .getAll()
          .map(({ name, value }) => ({ name, value }));
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
    error: authError, // 💡 【追加】エラー内容を受け取る
  } = await supabase.auth.getUser();

  const url = request.nextUrl;

  // 💡 【追加】Vercelのログ画面に本当の理由を吐き出させる
  console.log('=== 🔐 ミドルウェア認証デバッグ ===');
  console.log('ユーザーが存在するか:', !!user);
  if (authError) {
    console.error('🚨 拒否された本当の理由:', authError.message);
  }

  // 4. 除外設定
  const isAuthPage =
    url.pathname.startsWith('/login') || url.pathname === '/callback';
  if (isAuthPage) {
    return supabaseResponse;
  }

  // 5. 未ログイン時のガード（リダイレクト先を今いるドメインに固定）
  if (!user) {
    // ⭕ originを使うので、Preview環境でも絶対にクラッシュしません！
    return NextResponse.redirect(new URL('/login', origin));
  }

  // 6. ログイン済みで /login にアクセスした場合
  if (user && url.pathname === '/login') {
    return NextResponse.redirect(new URL('/', origin));
  }

  return supabaseResponse;
}
