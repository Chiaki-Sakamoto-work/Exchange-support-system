'use client';

import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
const PRESETS = ['13:00', '14:00', '19:00', '20:00'];

const ITEM_H = 40;
const VISIBLE = 5;
const PAD = ((VISIBLE - 1) / 2) * ITEM_H;
const COL_H = ITEM_H * VISIBLE;

function parse(value: string) {
  if (!value) return { date: '', time: '' };
  if (value.includes('T')) {
    const [date, time] = value.split('T');
    return { date, time };
  }
  return { date: value, time: '' };
}

function format(date: string, time: string) {
  if (!date && !time) return '';
  if (!date) return `T${time}`;
  if (!time) return date;
  return `${date}T${time}`;
}

function WheelColumn({
  values,
  selected,
  onSelect,
}: {
  values: number[];
  selected: number;
  onSelect: (n: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const settleRef = useRef<number | null>(null);
  const userScrolling = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const idx = values.indexOf(selected);
    if (idx < 0) return;
    const target = idx * ITEM_H;
    if (!userScrolling.current && Math.abs(el.scrollTop - target) > 1) {
      el.scrollTop = target;
    }
  }, [selected, values]);

  const handleSettle = () => {
    const el = ref.current;
    if (!el) return;
    const idx = Math.round(el.scrollTop / ITEM_H);
    const clamped = Math.max(0, Math.min(values.length - 1, idx));
    const v = values[clamped];
    const target = clamped * ITEM_H;
    if (Math.abs(el.scrollTop - target) > 0.5) {
      el.scrollTo({ top: target, behavior: 'smooth' });
    }
    userScrolling.current = false;
    if (v !== selected) onSelect(v);
  };

  const onScroll = () => {
    userScrolling.current = true;
    if (settleRef.current) window.clearTimeout(settleRef.current);
    settleRef.current = window.setTimeout(handleSettle, 140);
  };

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    el.scrollTop += e.deltaY;
  };

  const idx = values.indexOf(selected);
  const goPrev = () => {
    if (idx > 0) onSelect(values[idx - 1]);
  };
  const goNext = () => {
    if (idx >= 0 && idx < values.length - 1) onSelect(values[idx + 1]);
  };

  return (
    <div className='flex-1 flex flex-col items-center gap-1'>
      <button
        type='button'
        onClick={goPrev}
        disabled={idx <= 0}
        className='w-7 h-7 rounded-md text-muted-foreground hover:text-accent hover:bg-card disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-center transition-colors'
        aria-label='前へ'
      >
        <ChevronUp className='w-4 h-4' />
      </button>
      <div className='relative w-full' style={{ height: COL_H }}>
        <div
          className='pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 rounded-md bg-accent/10 border border-accent/30'
          style={{ height: ITEM_H }}
        />
        <div
          ref={ref}
          onScroll={onScroll}
          onWheel={onWheel}
          className='h-full overflow-y-scroll overscroll-contain'
          // biome-ignore lint/style/useNamingConvention: React CSSProperties require Webkit prefix
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          <div style={{ height: PAD }} />
          {values.map((v) => {
            const active = v === selected;
            return (
              <button
                key={v}
                type='button'
                onClick={() => onSelect(v)}
                className={`w-full flex items-center justify-center tabular-nums transition-colors ${
                  active ? 'text-accent' : 'text-foreground hover:text-accent'
                }`}
                style={{ height: ITEM_H }}
              >
                {String(v).padStart(2, '0')}
              </button>
            );
          })}
          <div style={{ height: PAD }} />
        </div>
      </div>
      <button
        type='button'
        onClick={goNext}
        disabled={idx >= values.length - 1}
        className='w-7 h-7 rounded-md text-muted-foreground hover:text-accent hover:bg-card disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-center transition-colors'
        aria-label='次へ'
      >
        <ChevronDown className='w-4 h-4' />
      </button>
    </div>
  );
}

export function DateTimePicker({
  id,
  value,
  onChange,
  minDate,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  minDate?: string;
}) {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timePanelRef = useRef<HTMLDivElement>(null);
  const { date, time } = parse(value);
  const [hourStr, minuteStr] = time ? time.split(':') : ['', ''];
  const hour = hourStr ? parseInt(hourStr, 10) : 19;
  const minute = minuteStr ? parseInt(minuteStr, 10) : 0;
  const hasDate = !!date;
  const hasTime = !!time;
  const [open, setOpen] = useState(hasDate && hasTime);
  const [showPresets, setShowPresets] = useState(true);

  useEffect(() => {
    if (!hasDate) setOpen(false);
  }, [hasDate]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const panel = timePanelRef.current;
      const target = event.target;
      if (!panel || !(target instanceof Node) || panel.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [open]);

  const openDatePicker = () => {
    const el = dateInputRef.current;
    if (!el) return;
    const anyEl = el as HTMLInputElement & { showPicker?: () => void };
    if (typeof anyEl.showPicker === 'function') {
      try {
        anyEl.showPicker();
        return;
      } catch {}
    }
    el.focus();
    el.click();
  };

  const setHm = (h: number, m: number) => {
    if (!date) return;
    const t = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    onChange(format(date, t));
  };

  const selectPreset = (preset: string) => {
    if (!date) return;
    onChange(format(date, preset));
    setOpen(false);
  };

  const handleDateChange = (nextDate: string) => {
    if (!nextDate) {
      onChange('');
      setOpen(false);
      return;
    }
    onChange(format(nextDate, time));
  };

  const clearTime = () => {
    onChange(format(date, ''));
    setOpen(false);
  };

  return (
    <div className='space-y-2'>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Custom wrapper for input picker */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: Custom wrapper for input picker */}
      <div
        onClick={openDatePicker}
        className='flex items-center gap-2 bg-card border border-border rounded-xl h-12 px-3 cursor-pointer hover:border-accent transition-colors'
      >
        <Calendar className='w-4 h-4 text-muted-foreground shrink-0' />
        <input
          id={id}
          ref={dateInputRef}
          type='date'
          value={date}
          min={minDate}
          onChange={(e) => handleDateChange(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className='flex-1 bg-transparent outline-none text-sm text-foreground cursor-pointer'
        />
      </div>

      {hasDate &&
        (!open ? (
          <div
            className={`relative w-full flex items-center rounded-xl transition-colors ${
              hasTime
                ? 'bg-card border border-border hover:border-[#3182f6] focus-within:border-[#3182f6]'
                : 'bg-card border border-dashed border-border hover:border-[#3182f6] focus-within:border-[#3182f6] text-muted-foreground hover:text-[#3182f6]'
            }`}
          >
            <button
              type='button'
              onClick={() => setOpen(true)}
              className={`flex-1 flex items-center gap-2 h-12 px-3 rounded-xl outline-none ${
                hasTime ? 'text-foreground' : 'justify-center'
              }`}
            >
              <Clock className='w-4 h-4 shrink-0' />
              <span className='text-sm flex-1 text-left tabular-nums'>
                {hasTime
                  ? `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
                  : '時間を指定する'}
              </span>
            </button>
            {hasTime && (
              <button
                type='button'
                onClick={(e) => {
                  e.stopPropagation();
                  clearTime();
                }}
                className='mx-3 text-[11px] text-muted-foreground hover:text-accent transition-colors relative z-10'
                aria-label='時間をクリア'
              >
                クリア
              </button>
            )}
          </div>
        ) : (
          // biome-ignore lint/a11y/useKeyWithClickEvents: Custom picker chrome closes when clicked.
          // biome-ignore lint/a11y/noStaticElementInteractions: Custom picker chrome closes when clicked.
          <div
            ref={timePanelRef}
            className='bg-card border border-border rounded-xl p-3 space-y-2'
            onClick={() => setOpen(false)}
          >
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2 text-muted-foreground'>
                <Clock className='w-4 h-4' />
                <span className='text-sm'>時間</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-foreground tabular-nums'>
                  {String(hour).padStart(2, '0')}:
                  {String(minute).padStart(2, '0')}
                </span>
                <button
                  type='button'
                  onClick={() => setOpen(false)}
                  className='w-6 h-6 rounded-full bg-secondary text-muted-foreground hover:bg-foreground hover:text-white flex items-center justify-center transition-colors'
                  aria-label='時間UIを閉じる'
                >
                  <X className='w-3 h-3' />
                </button>
              </div>
            </div>

            {/* biome-ignore lint/a11y/useKeyWithClickEvents: Wheel interactions should not close the picker. */}
            {/* biome-ignore lint/a11y/noStaticElementInteractions: Wheel interactions should not close the picker. */}
            <div
              className='flex items-stretch gap-2 bg-secondary rounded-lg px-2 py-1'
              onClick={(e) => e.stopPropagation()}
            >
              <WheelColumn
                values={HOURS}
                selected={hour}
                onSelect={(h) => setHm(h, minute)}
              />
              <div className='flex items-center justify-center text-muted-foreground tabular-nums'>
                :
              </div>
              <WheelColumn
                values={MINUTES}
                selected={minute}
                onSelect={(m) => setHm(hour, m)}
              />
            </div>

            <div className='flex items-center justify-between pt-1'>
              <button
                type='button'
                onClick={() => {
                  setShowPresets((s) => !s);
                }}
                className='flex items-center gap-1 text-[11px] text-muted-foreground hover:text-accent transition-colors'
              >
                <Sparkles className='w-3 h-3' />
                <span>
                  {showPresets ? 'プリセットを隠す' : 'プリセットを表示'}
                </span>
              </button>
              {showPresets && (
                <div className='flex flex-wrap gap-1 justify-end'>
                  {PRESETS.map((p) => {
                    const active = time === p;
                    return (
                      <button
                        key={p}
                        type='button'
                        onClick={() => selectPreset(p)}
                        className={`px-2 py-0.5 rounded-full text-[11px] tabular-nums transition-colors ${
                          active
                            ? 'bg-accent text-white'
                            : 'bg-secondary text-muted-foreground hover:bg-foreground hover:text-white'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}
