import { createClient } from '@/lib/supabase/server';

export async function auth() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  console.log('[auth] user:', user?.id ?? null, 'error:', error?.message ?? null);

  if (error || !user) {
    return null;
  }

  return {
    user: {
      id: user.id,
      email: user.email,
    },
  };
}
