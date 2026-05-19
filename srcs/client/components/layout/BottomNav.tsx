'use client';
import { House, UserCircle, Utensils } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '../ui/Tabs';

const NAV_ITEMS = [
  {
    href: '/create',
    icon: Utensils,
    label: 'MYイベント',
  },
  {
    href: '/',
    icon: House,
    label: 'ホーム',
  },
  {
    href: '/profile',
    icon: UserCircle,
    label: 'プロフィール',
  },
] as const;

interface BottomNavProps {
  className?: string;
  listClassName?: string;
}

export const BottomNav = ({ className, listClassName }: BottomNavProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const activeValue =
    NAV_ITEMS.find((item) => item.href === pathname)?.href ?? '/';

  const handleNavigte = (href: string) => {
    if (href !== pathname) {
      router.push(href);
    }
  };

  return (
    <div className='fixed inset-x-0 bottom-6 z-50 flex justify-center px-4'>
      <Tabs
        value={activeValue}
        variant='invert'
        className={cn('w-full max-w-md', className)}
      >
        <TabsList
          className={cn(
            'h-20 w-full justify-around rounded-2xl border border-border bg-card/90 p-2 shadow-2xl backdrop-blur-lg',
            listClassName,
          )}
        >
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
            <TabsTrigger
              key={href}
              value={href}
              onClick={() => handleNavigte(href)}
              className='h-full rounded-2xl px-2 py-2 text-muted-foreground data-active:scale-105 data-active:text-foreground'
            >
              <span className='flex flex-col items-center justify-center gap-1'>
                <Icon className='size-[15px]' />
                <span className='text-[12px] font-bold tracking-normal'>
                  {label}
                </span>
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};
