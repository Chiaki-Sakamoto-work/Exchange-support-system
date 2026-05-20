import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <h1 className='text-2xl font-bold mb-6'>アプリにログイン</h1>
      <LoginForm />
    </div>
  );
}
