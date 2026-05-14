'use client'; // インタラクションを入れるなら必要

import { signInWithGoogle } from '@/features/auth/actions';

export function LoginForm() {
  return (
    <form action={signInWithGoogle}>
      <button
        type='submit'
        className='px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 flex items-center transition-all'
      >
        Googleでログイン
      </button>
    </form>
  );
}
