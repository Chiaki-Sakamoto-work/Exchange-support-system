import type * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.ComponentProps<'input'> {
  icon?: React.ReactNode;
}

function Input({ className, type, icon, ...props }: InputProps) {
  return (
    <div className={cn('relative w-full peer', className)}>
      {icon && (
        <div className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none'>
          {icon}
        </div>
      )}
      <input
        type={type}
        data-slot='input'
        className={cn(
          'h-12 w-full min-w-0 rounded-[14px] border border-input bg-white px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
          icon && 'pl-10',
          className,
        )}
        {...props}
      />
    </div>
  );
}

export { Input };
