import { BottomNav } from '@components/layout/BottomNav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-background'>
      <header className='p-6 flex items-center gap-2 h-26'></header>

      <main className='max-w-[632px] mx-auto pb-24'>{children}</main>

      <BottomNav className='max-w-[672px]' listClassName='w-full' />
    </div>
  );
}
