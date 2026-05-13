'use client';

import { Button } from '@shared/ui/Button';
import { Minus, Plus } from 'lucide-react';
import type * as React from 'react';
import { cn } from '@/lib/utils';

const sizeConfig = {
  sm: {
    container: 'w-24 p-1',
    button: 'icon-sm' as const,
    input: 'w-8 text-sm',
    icon: 'size-3.5',
  },
  default: {
    container: 'w-32 p-1.5',
    button: 'icon' as const,
    input: 'w-10 text-base',
    icon: 'size-4',
  },
  lg: {
    container: 'w-40 p-1.5',
    button: 'icon-lg' as const,
    input: 'w-12 text-xl',
    icon: 'size-5',
  },
};

export interface StepperProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'size'
  > {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: keyof typeof sizeConfig; // 'sm' | 'default' | 'lg'
}

export function Stepper({
  value,
  onChange,
  min = 0,
  max = 99,
  size = 'default',
  className,
  ...props
}: StepperProps) {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!Number.isNaN(newValue)) {
      const boundedValue = Math.max(min, Math.min(max, newValue));
      onChange(boundedValue);
    } else {
      onChange(min);
    }
  };

  const config = sizeConfig[size];

  return (
    <div
      className={cn(
        'inline-flex items-center justify-between bg-white rounded-full border transition-all duration-200',
        config.container,
        className,
      )}
    >
      <Button
        type='button'
        variant='secondary'
        size={config.button}
        onClick={handleDecrement}
        disabled={value <= min}
        aria-label='Decrease value'
      >
        <Minus className={config.icon} />
      </Button>

      <input
        type='number'
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        className={cn(
          'font-medium text-center bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
          config.input,
        )}
        {...props}
      />

      <Button
        type='button'
        variant='accent'
        size={config.button}
        onClick={handleIncrement}
        disabled={value >= max}
        aria-label='Increase value'
      >
        <Plus className={config.icon} />
      </Button>
    </div>
  );
}
