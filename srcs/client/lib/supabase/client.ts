import { createBrowserClient } from '@supabase/ssr';

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // ここで型ガード（存在チェック）を行う
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  // チェックを通れば、これらは string 型として扱われるのでエラーが消えます
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};
