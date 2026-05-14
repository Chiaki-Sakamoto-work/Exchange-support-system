// srcs/client/app/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  // ブラウザの戻り先は常に localhost に固定
  const origin = process.env.NEXT_PROG_URL || process.env.FRONTEND;

  if (code) {
    const supabase = await createClient();
    // 内部通信 (host.docker.internal) を使ってセッション交換
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error('❌ exchangeCodeForSession Error:', error.message);
  }

  return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`);
}

