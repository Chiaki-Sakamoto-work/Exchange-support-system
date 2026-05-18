'use client';
import { LayoutDashboard, PlusCircle, UserCircle, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '../ui/Tabs';

export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <Tabs defaultValue='account' className='flex flex-col w-[632px] h-[540px]'>
      {/* タブのメニュー部分 */}
      <TabsList className='w-full h-[48px] shrink-0'>
        <TabsTrigger value='/'>
          <NavItem
            href='/'
            icon={<LayoutDashboard size={22} />}
            label='ホーム'
            active={pathname === '/'}
          />
        </TabsTrigger>
        <TabsTrigger value='/create'>
          <NavItem
            href='/create'
            icon={<LayoutDashboard size={22} />}
            label='ホーム'
            active={pathname === '/'}
          />
        </TabsTrigger>
        <TabsTrigger value='/join'>
          <NavItem
            href='/'
            icon={<LayoutDashboard size={22} />}
            label='ホーム'
            active={pathname === '/'}
          />
        </TabsTrigger>
        <TabsTrigger value='/profile'>
          <NavItem
            href='/'
            icon={<LayoutDashboard size={22} />}
            label='ホーム'
            active={pathname === '/'}
          />
        </TabsTrigger>
      </TabsList>
    </Tabs>
    // <nav className='fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-white/90 backdrop-blur-lg border border-zinc-200 rounded-[32px] p-2 shadow-2xl z-50 flex justify-around items-center h-20'>
    //   {/* pathname と href が一致している時だけ active を true にする */}
    //   <NavItem
    //     href='/'
    //     icon={<LayoutDashboard size={22} />}
    //     label='ホーム'
    //     active={pathname === '/'}
    //   />
    //   <NavItem
    //     href='/create'
    //     icon={<PlusCircle size={22} />}
    //     label='開催する'
    //     active={pathname === '/create'}
    //   />
    //   <NavItem
    //     href='/join'
    //     icon={<Users size={22} />}
    //     label='参加する'
    //     active={pathname === '/join'}
    //   />
    //   <NavItem
    //     href='/profile'
    //     icon={<UserCircle size={22} />}
    //     label='マイページ'
    //     active={pathname === '/profile'}
    //   />
    // </nav>
  );
};

const NavItem = ({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) => (
  <Link
    href={href}
    className={`flex flex-col items-center justify-center gap-1 w-full h-full rounded-2xl transition-all duration-300 ${
      active
        ? 'bg-zinc-100 text-zinc-950 scale-105'
        : 'text-zinc-400 hover:text-zinc-600'
    }`}
  >
    <div className={`${active ? 'animate-in zoom-in duration-300' : ''}`}>
      {icon}
    </div>
    <span className='text-[10px] font-bold tracking-tighter'>{label}</span>
  </Link>
);
