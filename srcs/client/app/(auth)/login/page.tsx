import { signInWithGoogle } from '@/features/auth/actions'

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">アプリにログイン</h1>
      <form action={signInWithGoogle}>
        <button 
          type="submit"
          className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 flex items-center"
        >
          Googleでログイン
        </button>
      </form>
    </div>
  )
}
