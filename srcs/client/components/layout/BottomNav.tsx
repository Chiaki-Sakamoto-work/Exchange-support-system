'use client';
import {
  House,
  LayoutDashboard,
  Plus,
  PlusCircle,
  User,
  UserCircle,
  Users,
  UsersRound,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';

// Propsの型定義：現在のタブと、タブを切り替えるための関数を受け取る
type BottomNavProps = {
  className?: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export const BottomNav = ({
  className = '',
  activeTab,
  onTabChange,
}: BottomNavProps) => {
  const pathname = usePathname();

  const tabs = [
    { id: 'home', label: 'ホーム', icon: <House />, href: '/' },
    { id: 'create', label: '開催する', icon: <Plus />, href: '/create' },
    { id: 'join', label: '参加する', icon: <UsersRound />, href: '/join' },
    { id: 'mypage', label: 'マイページ', icon: <User />, href: '/mypage' },
  ] as const;

  return (
    <nav>
      <Tabs
        value={activeTab}
        onValueChange={(value) => onTabChange(value)}
        className='w-full'
        variant='invert'
        indicatorClassName='inset-1'
      >
        <TabsList
          className={`fixed inset-x-0 mx-auto w-full justify-around ${className}`}
        >
          {tabs.map((tab) => (
            <Link key={tab.id} href={tab.href}>
              <TabsTrigger value={tab.id} className='h-[64px] p-2'>
                <div className='flex flex-col items-center justify-center gap-1 '>
                  <span className='flex-shrink-0 [&_svg]:w-6 [&_svg]:h-6 [&_svg]:stroke-current'>
                    {tab.icon}
                  </span>
                  <span className='text-[10px] font-bold'>{tab.label}</span>
                </div>
              </TabsTrigger>
            </Link>
          ))}
        </TabsList>
      </Tabs>
    </nav>
  );
};
