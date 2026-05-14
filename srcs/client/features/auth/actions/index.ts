'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
export async function signInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: process.env.AUTH_GOOGLE_CALLBACK_URL,
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
