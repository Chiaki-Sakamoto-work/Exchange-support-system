import { BottomNav } from '@components/layout/BottomNav';
import { Header } from '@/components/layout/Header';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-dvh flex-col overflow-hidden bg-background'>
      <Header />

      <main className='mx-auto flex min-h-0 w-full max-w-[632px] flex-1 flex-col pb-24'>
        {children}
      </main>

      <BottomNav className='max-w-[672px]' listClassName='w-full' />
    </div>
  );
}
