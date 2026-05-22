import { BottomNav } from '@components/layout/BottomNav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-dvh flex-col overflow-hidden bg-background'>
      <header className='flex h-26 shrink-0 items-center gap-2 p-6'></header>

      <main className='mx-auto flex min-h-0 w-full max-w-[632px] flex-1 flex-col pb-24'>
        {children}
      </main>

      <BottomNav className='max-w-[672px]' listClassName='w-full' />
    </div>
  );
}
