'use client';

import { ChatPanel } from '@feature/chat/components/ChatPanel';
import {
  ExploreDetailPanel,
  HostDetailPanel,
  JoinedDetailPanel,
} from '@feature/events/components/EventPanel';
import { useState, useRef } from 'react';

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
        className='fixed inset-0 z-70 flex items-center justify-center bg-black/20 backdrop-blue-sm transition-opacity p-4 md:p-0 overflow-hidden overscroll-none touch-none'
        onClick={onClose}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className='relative w-full h-[80vh] md:h-[75vh] flex justify-center'>
          {/*event detail panel*/}
          {/* biome-ignore lint/a11y/useSemanticElements: panel contains nested interactive elements */}
          <div
            role='button'
            tabIndex={0}
            className={`
              absolute rounded-2xl p-6 transition-all duration-500 ease-out bg-white/70 backdrop-blur-md border border-white
              w-[95%] h-[95%] top-1/2 -translate-y-1/2
              md:w-[500px] md:h-[600px] md:left-50 md:top-1/2 md:-translate-y-1/2
              ${
                activeLayer === 'details'
                  ? 'z-70 opacity-100 shadow-2xl scale-100 left-1/2 -translate-x-1/2 md:scale-105 md:left-50 md:translate-x-0'
                  : 'z-60 opacity-40 shadow-sm scale-90 cursor-pointer left-[-5%] -translate-x-0 md:opacity-85 md:shadow-lg md:scale-100 md:left-50 md:translate-x-0'
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
          {/*chat panel*/}
          {/* biome-ignore lint/a11y/useSemanticElements: panel contains nested interactive elements */}
          <div
            role='button'
            tabIndex={0}
            className={`
              absolute rounded-2xl p-6 transition-all duration-500 ease-out
              bg-white/70 backdrop-blur-md border border-white/40
              w-[95%] h-[90%] top-1/2 -translate-y-1/2
              md:w-[700px] md:h-[calc(100%-40px)] md:right-50 md:left-auto md:top-1/2 md:-translate-y-1/2
              ${
                activeLayer === 'chat'
                  ? 'z-70 opacity-100 shadow-2xl scale-100 left-1/2 -translate-x-1/2 md:scale-105 md:right-50 md:translate-x-0'
                  : 'z-60 opacity-40 shadow-sm scale-90 cursor-pointer left-[105%] -translate-x-full md:opacity-85 md:shadow-lg md:scale-100 md:right-50 md:translate-x-0'
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
