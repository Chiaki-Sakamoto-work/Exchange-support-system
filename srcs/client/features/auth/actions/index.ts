'use server';

import { headers } from 'next/headers'; // 💡 【追加】これをインポートします
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function signInWithGoogle() {
  const supabase = await createClient();

  // 💡 今アクセスされているドメイン（host）をサーバー側で動的に取得
  const headerList = await headers();
  let host = headerList.get('host') || 'localhost:3000'; // 例: "exchange-support-system-2hna0alsj.vercel.app"

  // ローカル環境（localhost）なら http、Vercel上なら https に自動切り替え
  const protocol =
    host?.includes('localhost') || host?.includes('127.0.0.1')
      ? 'http'
      : 'https';

  if (process.env.NODE_ENV === 'development') {
    host = 'localhost:3000';
  }

  // 💡 本番・テスト・ローカルに100%自動追従するコールバックURLをその場で組み立てる
  const redirectTo = `${protocol}://${host}/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectTo,
      queryParams: {
        prompt: 'select_account',
        hd: process.env.DOMAIN ?? '',
      },
    },
  });

  if (error) {
    console.error('Auth error:', error.message);
    return redirect('/login?error=auth-failed');
  }

  if (data.url) {
    let browserUrl = data.url;

    if (process.env.NODE_ENV === 'development') {
      browserUrl = data.url.replace('host.docker.internal', 'localhost');
    }

    console.log('🔗 Redirecting browser to:', browserUrl);

    // 書き換えたURLでリダイレクト
    return redirect(browserUrl);
  }
}
