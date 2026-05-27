'use client';
import { House, List, Pencil, UserCircle, Utensils } from 'lucide-react';
import { motion } from 'motion/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '../ui/Tabs';

const NAV_ITEMS = [
  {
    href: '/create',
    icon: Pencil,
    label: '予定管理',
  },
  {
    href: '/',
    icon: List,
    label: '一覧',
  },
  {
    href: '/profile',
    icon: UserCircle,
    label: 'プロフィール',
  },
] as const;

type NavItemHref = (typeof NAV_ITEMS)[number]['href'];

const TAB_COUNT = NAV_ITEMS.length;
const ACTIVE_OVERLAY_TRANSITION = {
  type: 'spring' as const,
  bounce: 0.2,
  duration: 0.6,
};

interface BottomNavProps {
  className?: string;
  listClassName?: string;
}

export const BottomNav = ({ className, listClassName }: BottomNavProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const activeValue =
    NAV_ITEMS.find(({ href }) =>
      href === '/'
        ? pathname === href
        : pathname === href || pathname.startsWith(`${href}/`),
    )?.href ?? '/';
  const [visualActiveValue, setVisualActiveValue] = useState(activeValue);

  useEffect(() => {
    setVisualActiveValue(activeValue);
  }, [activeValue]);

  useEffect(() => {
    for (const { href } of NAV_ITEMS) {
      if (href !== activeValue) {
        router.prefetch(href);
      }
    }
  }, [activeValue, router]);

  const activeIndex = Math.max(
    NAV_ITEMS.findIndex(({ href }) => href === visualActiveValue),
    0,
  );
  const overlayX = `${activeIndex * 100}%`;
  const clipLeft = `${(activeIndex / TAB_COUNT) * 100}%`;
  const clipRight = `${((TAB_COUNT - activeIndex - 1) / TAB_COUNT) * 100}%`;
  const navGridStyle = {
    gridTemplateColumns: `repeat(${TAB_COUNT}, minmax(0, 1fr))`,
  };

  const handleNavigate = (href: NavItemHref) => {
    setVisualActiveValue(href);

    if (href !== pathname) {
      router.push(href);
    }
  };

  return (
    <div className='fixed inset-x-0 bottom-6 z-50 flex justify-center px-4'>
      <Tabs
        value={visualActiveValue}
        variant='invert'
        indicatorClassName='hidden'
        className={cn('w-full max-w-md', className)}
      >
        <TabsList
          className={cn(
            'relative grid h-20 w-full overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-2 shadow-xl backdrop-blur-sm',
            listClassName,
          )}
          style={navGridStyle}
        >
          <motion.div
            aria-hidden='true'
            initial={false}
            animate={{ x: overlayX }}
            transition={ACTIVE_OVERLAY_TRANSITION}
            className='pointer-events-none absolute inset-y-2 left-2 z-0 rounded-2xl bg-background/55 shadow-sm ring-1 ring-border/40'
            style={{ width: `calc((100% - 1rem) / ${TAB_COUNT})` }}
          />
          <motion.div
            aria-hidden='true'
            initial={false}
            animate={{
              clipPath: `inset(0 ${clipRight} 0 ${clipLeft})`,
            }}
            transition={ACTIVE_OVERLAY_TRANSITION}
            className='pointer-events-none absolute inset-2 z-20 grid text-accent'
            style={navGridStyle}
          >
            {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
              <span
                key={href}
                className={cn(
                  'flex h-full items-center justify-center rounded-2xl px-2 py-2 transition-transform',
                  href === visualActiveValue && 'scale-105',
                )}
              >
                <span className='flex flex-col items-center justify-center gap-1'>
                  <Icon className='size-[15px]' />
                  <span className='text-[12px] font-bold tracking-normal'>
                    {label}
                  </span>
                </span>
              </span>
            ))}
          </motion.div>
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
            <TabsTrigger
              key={href}
              value={href}
              onClick={() => handleNavigate(href)}
              className='z-10 h-full rounded-2xl px-2 py-2 text-muted-foreground data-active:scale-105 data-active:text-foreground'
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
