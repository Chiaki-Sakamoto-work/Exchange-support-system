import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';
  const origin = new URL(request.url).origin;

  // 💡 【超重要】先にリダイレクト先のレスポンスオブジェクトを作ってしまう！
  const response = NextResponse.redirect(`${origin}${next}`);

  if (code) {
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
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      },
    );

    // 本物のSupabase Cloudに対してセッション交換を実行
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 💡 クッキーが100%乗っかった状態の response をそのままブラウザに返す！
      return response;
    }
    console.error('❌ exchangeCodeForSession Error:', error.message);
  }

  // 失敗した場合はエラーパラメーター付きでログイン画面へ戻す
  return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`);
}
