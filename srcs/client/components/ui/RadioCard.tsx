import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Check } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

const RadioCard = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'group relative flex w-[366px] h-[84px] cursor-pointer items-center justify-between rounded-[16px] border-2 border-transparent bg-card px-6 py-4 outline-none',

        'transition-transform duration-200 ease-in-out hover:scale-[1.02] active:scale-[0.98]',

        'data-[state=checked]:border-accent data-[state=checked]:bg-accent/[5%]',
        className,
      )}
      {...props}
    >
      <div className='flex flex-1 flex-col justify-center text-left'>
        {children}
      </div>

      <div
        className={cn(
          'ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground',
          'scale-50 opacity-0',
          'transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
          'group-data-[state=checked]:scale-100 group-data-[state=checked]:opacity-100',
        )}
      >
        <Check className='h-4 w-4' />
      </div>
    </RadioGroupPrimitive.Item>
  );
});
RadioCard.displayName = 'RadioCard';

// ============================================================================
// 2. RadioCardHeader
// ============================================================================
const RadioCardHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5', className)}
    {...props}
  />
));
RadioCardHeader.displayName = 'RadioCardHeader';

// ============================================================================
// 3. RadioCardTitle
// ============================================================================
const RadioCardTitle = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-base font-bold leading-snug', className)}
    {...props}
  />
));
RadioCardTitle.displayName = 'RadioCardTitle';

// ============================================================================
// 4. RadioCardDescription
// ============================================================================
const RadioCardDescription = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
RadioCardDescription.displayName = 'RadioCardDescription';

export { RadioCard, RadioCardDescription, RadioCardHeader, RadioCardTitle };
