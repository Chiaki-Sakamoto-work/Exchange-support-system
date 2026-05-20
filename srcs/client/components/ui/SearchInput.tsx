'use client';

import { Search } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface SearchInputProps extends React.ComponentProps<'input'> {}

export function SearchInput({
  className,
  placeholder = '検索..',
  value: propValue,
  onChange,
  ...props
}: SearchInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [isCursorVisible, setIsCursorVisible] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isControlled = propValue !== undefined;
  const value = isControlled ? propValue : internalValue;

  const isActive = isFocused || (typeof value === 'string' && value.length > 0);

  const handleCancel = () => {
    setIsFocused(false);
    setIsCursorVisible(false);

    if (!isControlled) {
      setInternalValue('');
    }

    if (onChange && inputRef.current) {
      const mockEvent = {
        target: {
          ...inputRef.current,
          value: '',
        },
        currentTarget: {
          ...inputRef.current,
          value: '',
        },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange(mockEvent);
    }

    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(e.target.value);
    }
    if (onChange) {
      onChange(e);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    setTimeout(() => {
      setIsCursorVisible(true);
    }, 300);

    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setIsCursorVisible(false);

    if (props.onBlur) props.onBlur(e);
  };

  return (
    <div className={cn('flex items-center w-full overflow-hidden', className)}>
      <div className='relative flex-1 transition-all duration-300'>
        <div
          className={cn(
            'absolute inset-y-0 flex items-center pointer-events-none transition-all duration-300 z-10',
            isActive ? 'left-3 translate-x-0' : 'left-1/2 -translate-x-1/2',
          )}
        >
          <Search className='h-4 w-4 text-muted-foreground' />
          <span
            className={cn(
              'ml-2 text-muted-foreground transition-all duration-300 md:text-sm whitespace-nowrap',
              isActive ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100', // 이전으로 롤백 (delay 제거)
            )}
          >
            {placeholder}
          </span>
        </div>

        <input
          ref={inputRef}
          type='text'
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          }}
          className={cn(
            'h-12 w-full min-w-0 rounded-[14px] border border-input bg-white py-1 text-base transition-colors outline-none md:text-sm',
            'hover:border-accent focus:outline-none focus:ring-0 focus:border-input',
            'dark:bg-input/30 dark:disabled:bg-input/80',
            'pl-10 pr-4',
            !isActive && 'placeholder:text-transparent',
            !isCursorVisible && 'caret-transparent',
            className,
          )}
          placeholder={isActive ? placeholder : ''}
          {...props}
        />
      </div>

      <div
        className={cn(
          'transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap flex items-center',
          isActive ? 'w-16 opacity-100 ml-2' : 'w-0 opacity-0 ml-0',
        )}
      >
        <Button
          type='button'
          variant='ghost'
          className='h-10 w-full px-0'
          onMouseDown={(e) => {
            e.preventDefault();
            handleCancel();
          }}
        >
          クリア
        </Button>
      </div>
    </div>
  );
}
