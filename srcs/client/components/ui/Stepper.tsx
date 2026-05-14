'use client';

import { Minus, Plus } from 'lucide-react';
import type * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/Button';

/**
 * サイズごとのスタイリング設定
 */
const sizeConfig = {
  sm: {
    container: 'w-24 p-1', // 全体の幅とパディング
    button: 'icon-sm' as const, // ボタンのサイズ
    input: 'w-8 text-sm', // 入力欄の幅と文字サイズ
    icon: 'size-3.5', // アイコンのサイズ
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
  value: number; // 現在の値
  onChange: (value: number) => void; // 値が変更された時のコールバック
  min?: number; // 最小値 (デフォルト: 0)
  max?: number; // 最大値 (デフォルト: 99)
  size?: keyof typeof sizeConfig; // サイズ指定 ('sm' | 'default' | 'lg')
}

/**
 * Stepper: 数値を1ずつ増減させる入力コンポーネント
 * * @example
 * const [count, setCount] = useState(1);
 * <Stepper value={count} onChange={setCount} min={1} max={10} />
 */
export function Stepper({
  value,
  onChange,
  min = 0,
  max = 99,
  size = 'default',
  className,
  ...props
}: StepperProps) {
  // 値を減らす処理
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  // 値を増やす処理
  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  // 直接入力された時の処理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!Number.isNaN(newValue)) {
      // 最小値〜最大値の範囲に収める
      const boundedValue = Math.max(min, Math.min(max, newValue));
      onChange(boundedValue);
    } else {
      // 数値以外が入力された場合は最小値に戻す
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
      {/* 減少ボタン */}
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

      {/* 数値入力エリア */}
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

      {/* 増加ボタン */}
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
