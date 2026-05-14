'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function signInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.AUTH_GOOGLE_CALLBACK_URL}`,
    },
  });

  if (error) {
    console.error('Auth error:', error.message);
    return redirect('/login?error=auth-failed');
  }

  if (data.url) {
    redirect(data.url); // Googleのログイン画面へ飛ばす
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
