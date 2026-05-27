import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <main className='login-page flex min-h-dvh items-center justify-center overflow-hidden px-4 py-8'>
      <LoginForm />
    </main>
  );
}
