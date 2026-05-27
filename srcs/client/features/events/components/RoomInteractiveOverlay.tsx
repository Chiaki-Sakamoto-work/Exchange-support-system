'use client';

import { ChatPanel } from '@feature/chat/components/ChatPanel';
import {
  ExploreDetailPanel,
  HostDetailPanel,
  JoinedDetailPanel,
} from '@feature/events/components/EventPanel';
import { MessageSquare, TextAlignJustify } from 'lucide-react';
import { useRef, useState } from 'react';

type Props = {
  roomId: number;
  mode: 'hosted' | 'joined' | 'explore';
  onClose: () => void;
  onSuccess: () => void;
};

export const RoomInteractiveOverlay = ({
  roomId,
  mode,
  onClose,
  onSuccess,
}: Props) => {
  const [activeLayer, setActiveLayer] = useState<'details' | 'chat'>('details');
  const touchStartX = useRef<number | null>(null);
  const detailModalProps = {
    roomId: roomId,
    onClose: onClose,
    onSuccess: onSuccess,
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;
    const threshold = 40;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        setActiveLayer('chat');
      } else {
        setActiveLayer('details');
      }
    }
    touchStartX.current = null;
  };

  return (
    <>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: modal overlay */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: modal overlay */}
      <div
        className='fixed inset-0 z-70 flex flex-col items-center justify-center bg-black/20 backdrop-blue-sm transition-opacity p-4 md:p-0 overflow-hidden overscroll-none touch-none'
        onClick={onClose}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          role='tablist'
          className='absolute top-0 left-0 w-full h-14 bg-white/40 backdrop-blur-md flex items-center justify-center gap-12 px-6 md:hidden z-80 border-b border-white/10 select-none'
        >
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: tab navigation */}
          <div
            role='tab'
            tabIndex={0}
            className={`text-sm font-bold transition-all duration-300 h-full flex items-center gap-1.5 border-b-2 cursor-pointer ${
              activeLayer === 'details'
                ? 'text-emerald-500 border-emerald-500 scale-105'
                : 'text-black/40 border-transparent'
            }`}
            onClick={(e) => {
              setActiveLayer('details');
              e.stopPropagation();
            }}
          >
            <TextAlignJustify size={16} /> イベント詳細
          </div>
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: tab navigation */}
          <div
            role='tab'
            tabIndex={0}
            className={`text-sm font-bold transition-all duration-300 h-full flex items-center gap-1.5 border-b-2 cursor-pointer ${
              activeLayer === 'chat'
                ? 'text-emerald-500 border-emerald-500 scale-105'
                : 'text-black/40 border-transparent'
            }`}
            onClick={(e) => {
              setActiveLayer('chat');
              e.stopPropagation();
            }}
          >
            <MessageSquare size={16} /> チャットルーム
          </div>
        </div>

        <div className='relative w-full h-[75vh] md:h-[85vh] max-w-[1400px] flex flex-col items-center justify-center md:flex-row md:items-center md:gap-6 mt-8 md:mt-0'>
          {/* biome-ignore lint/a11y/useSemanticElements: panel contains nested interactive elements */}
          <div
            role='button'
            tabIndex={0}
            className={`
              absolute rounded-2xl p-6 transition-all duration-500 ease-out border border-white
              w-[95%] h-full top-1/2 -translate-y-1/2
              md:static md:w-[450px] md:h-full md:top-auto md:translate-y-0 md:left-auto md:translate-x-0
              md:border-2 md:scale-100
              ${
                activeLayer === 'details'
                  // ⭐ アクティブ時: 純白(bg-white), すりガラスなし(backdrop-blur-none)
                  ? 'z-70 bg-white backdrop-blur-none opacity-100 shadow-2xl scale-100 left-1/2 -translate-x-1/2 md:border-emerald-400 md:shadow-[0_0_20px_rgba(52,211,153,0.3)]'
                  // ⭐ 非アクティブ時: すりガラス白(bg-white/90 backdrop-blur-md)
                  : 'z-60 bg-white/90 backdrop-blur-md opacity-60 shadow-sm scale-90 cursor-pointer left-[-5%] -translate-x-0 md:opacity-70 md:border-transparent md:shadow-none'
              }
            `}
            onMouseEnter={() => setActiveLayer('details')}
            onClick={(e) => {
              setActiveLayer('details');
              e.stopPropagation();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setActiveLayer('chat');
              }
            }}
          >
            {mode === 'hosted' && <HostDetailPanel {...detailModalProps} />}
            {mode === 'joined' && <JoinedDetailPanel {...detailModalProps} />}
            {mode === 'explore' && <ExploreDetailPanel {...detailModalProps} />}
          </div>

          {/* biome-ignore lint/a11y/useSemanticElements: panel contains nested interactive elements */}
          <div
            role='button'
            tabIndex={0}
            className={`
              absolute rounded-2xl p-6 transition-all duration-500 ease-out border border-white/40
              w-[95%] h-full top-1/2 -translate-y-1/2
              md:static md:flex-1 md:max-w-[750px] md:h-full md:top-auto md:translate-y-0 md:right-auto md:left-auto md:translate-x-0
              md:border-2 md:scale-100
              ${
                activeLayer === 'chat'
                  // ⭐ アクティブ時: 純白(bg-white), すりガラスなし(backdrop-blur-none)
                  ? 'z-70 bg-white backdrop-blur-none opacity-100 shadow-2xl scale-100 left-1/2 -translate-x-1/2 md:border-emerald-400 md:shadow-[0_0_20px_rgba(52,211,153,0.3)]'
                  // ⭐ 非アクティブ時: すりガラス白(bg-white/90 backdrop-blur-md)
                  : 'z-60 bg-white/90 backdrop-blur-md opacity-60 shadow-sm scale-90 cursor-pointer left-[105%] -translate-x-full md:opacity-70 md:border-transparent md:shadow-none'
              }
            `}
            onMouseEnter={() => setActiveLayer('chat')}
            onClick={(e) => {
              setActiveLayer('chat');
              e.stopPropagation();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setActiveLayer('chat');
              }
            }}
          >
            <ChatPanel roomId={roomId} />
          </div>
        </div>
      </div>
    </>
  );
};
