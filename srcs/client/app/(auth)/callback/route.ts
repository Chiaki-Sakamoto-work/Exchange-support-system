import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  // リダイレクト先がない場合はトップページ（/）へ
  const next = requestUrl.searchParams.get('next') ?? '/';

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
            try {
              // 💡 responseではなく、cookieStore.set を使うのが Next.js 15 の絶対の掟！
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch (error) {
              console.error('Cookie Set Error:', error);
            }
          },
        },
      },
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 🎉 セッション交換成功！ 新しいクッキーを持ったままトップページへ
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    } else {
      console.error('❌ Supabase Auth Error:', error.message);
    }
  }

  // codeが無い、または交換に失敗した場合はエラー付きでログインへ戻す
  return NextResponse.redirect(
    new URL('/login?error=auth-callback-failed', requestUrl.origin),
  );
}
