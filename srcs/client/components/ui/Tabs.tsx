'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { AnimatePresence, motion } from 'motion/react';
import { Tabs as TabsPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/lib/utils';

// 1. Variant 타입을 정의합니다.
type TabsVariant = 'default' | 'line' | 'invert';

/**
 * タブの状態を共有するためのコンテキスト
 */
const TabsContext = React.createContext<{
  activeValue?: string;
  id?: string;
  variant?: TabsVariant;
  indicatorClassName?: string;
}>({});

interface TabsProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  defaultValue?: string;
  value?: string;
  indicatorClassName?: string;
  variant?: TabsVariant;
}

/**
 * Tabs: ルートコンテナ
 */
function Tabs({
  className,
  orientation = 'horizontal',
  value,
  defaultValue,
  onValueChange,
  indicatorClassName,
  variant = 'default',
  ...props
}: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue);
  const id = React.useId();

  const handleValueChange = (val: string) => {
    setActiveTab(val);
    onValueChange?.(val);
  };

  React.useEffect(() => {
    if (value !== undefined) setActiveTab(value);
  }, [value]);

  return (
    <TabsContext.Provider
      value={{ activeValue: activeTab, id, variant, indicatorClassName }}
    >
      {' '}
      <TabsPrimitive.Root
        value={activeTab}
        onValueChange={handleValueChange}
        data-slot='tabs'
        data-orientation={orientation}
        className={cn(
          'group/tabs flex gap-2 data-horizontal:flex-col',
          className,
        )}
        {...props}
      />
    </TabsContext.Provider>
  );
}

/**
 * TabsListのスタイル定義
 */
const tabsListVariants = cva(
  'group/tabs-list inline-flex w-fit items-center justify-center rounded-2xl p-[3px] text-muted-foreground group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none',
  {
    variants: {
      variant: {
        default: 'bg-muted',
        line: 'gap-1 bg-transparent',
        // invert일 때 쓸데없는 테두리와 그림자 제거
        invert: 'bg-white', // (BottomNav에서 bg-transparent를 주셨기 때문에 여기도 맞췄습니다)
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function TabsList({
  className,
  variant: propVariant,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  // Context에서 variant를 가져오고, props로 직접 넘긴 값이 있다면 우선 적용합니다.
  const context = React.useContext(TabsContext);
  const variant = propVariant || context.variant || 'default';

  return (
    <TabsPrimitive.List
      data-slot='tabs-list'
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

/**
 * TabsTrigger: タブの切り替えボタン
 */
function TabsTrigger({
  className,
  value,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const {
    activeValue,
    id,
    variant = 'default',
    indicatorClassName,
  } = React.useContext(TabsContext);
  const isActive = activeValue === value;

  return (
    <TabsPrimitive.Trigger
      value={value}
      data-slot='tabs-trigger'
      className={cn(
        "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-[14px] border border-transparent px-1.5 py-0.5 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 dark:text-muted-foreground dark:hover:text-foreground group-data-[variant=default]/tabs-list:data-active:shadow-sm group-data-[variant=line]/tabs-list:data-active:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        'group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent',
        'data-active:text-foreground dark:data-active:text-foreground',
        'after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100',
        className,
      )}
      {...props}
    >
      {isActive && (
        <motion.div
          layoutId={`tabs-indicator-${id}`}
          className={cn(
            'absolute inset-0 z-0 rounded-[14px] border border-transparent transition-colors group-data-[variant=line]/tabs-list:hidden',
            variant === 'invert'
              ? 'bg-muted dark:bg-muted/50'
              : 'bg-card shadow-sm dark:bg-input/30 dark:border-input',
            indicatorClassName || 'inset-0',
          )}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className='relative z-10 flex items-center gap-1.5'>
        {children}
      </span>
    </TabsPrimitive.Trigger>
  );
}

/**
 * TabsContent: 各タブの中身
 */
function TabsContent({
  className,
  value,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  const { activeValue } = React.useContext(TabsContext);
  const isActive = activeValue === value;

  return (
    <AnimatePresence mode='wait'>
      {isActive && (
        <TabsPrimitive.Content value={value} forceMount asChild>
          {/* @ts-expect-error: Radix UIとFramer MotionのonDragタイプ競合回避 */}
          <motion.div
            key={value}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            data-slot='tabs-content'
            className={cn('w-full h-full text-sm outline-none', className)}
            {...props}
          >
            {children}
          </motion.div>
        </TabsPrimitive.Content>
      )}
    </AnimatePresence>
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants };
