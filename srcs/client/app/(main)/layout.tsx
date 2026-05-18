import { BottomNav } from '@/components/Layout/BottomNav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50'>
      <header className='p-6 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800'>
        <div className='w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold'>
          N
        </div>
        <h1 className='text-xl font-bold tracking-tight'>Nomikai Hub</h1>
      </header>

      <main className='max-w-md mx-auto p-4 pb-24'>{children}</main>

      <BottomNav />
    </div>
  );
}
