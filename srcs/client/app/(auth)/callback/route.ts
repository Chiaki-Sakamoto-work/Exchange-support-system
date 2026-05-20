import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  // 💡 【ここを修正】今アクセスされているURLから「https://xxx.vercel.app」を自動抽出！
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // ⭕ originが「https://xxx.vercel.app」になるので絶対にクラッシュしない
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error('❌ exchangeCodeForSession Error:', error.message);
  }

  return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`);
}
