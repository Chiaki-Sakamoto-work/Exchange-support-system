export const dynamic = 'force-dynamic';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/';

  if (!code) {
    return NextResponse.redirect(
      new URL('/login?error=missing-code', requestUrl.origin),
    );
  }

  const cookieStore = await cookies();
  const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const internalUrl = process.env.SUPABASE_INTERNAL_URL || publicUrl;

  const supabase = createServerClient(
    publicUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      global: {
        fetch: (url, options) =>
          fetch(url.toString().replace(publicUrl, internalUrl), options),
      },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (_error) {}
        },
      },
    },
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (!error && data?.user) {
    const email = data.user.email;
    const allowedDomain = process.env.DOMAIN ?? '';

    if (!email?.endsWith(`@${allowedDomain}`)) {
      await supabase.auth.signOut();
      console.warn(`🚫 Domain restriction triggered: ${email} rejected.`);
      return NextResponse.redirect(
        new URL(`/login?error=domain_not_allowed`, requestUrl.origin),
      );
    }
  } else if (error) {
    console.error('❌ Supabase Auth Error:', error.message);
    return NextResponse.redirect(
      new URL(`/login?error=auth_failed`, requestUrl.origin),
    );
  }
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
