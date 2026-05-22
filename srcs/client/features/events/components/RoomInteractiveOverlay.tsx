'use client';

{
  /*import { ChatPanel } from '@feature/chat/components/ChatPanel';*/
}

import { EventInfoPanel } from '@feature/events/components/EventInfoPanel';
import { useState } from 'react';

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

  return (
    <>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: modal overlay */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: modal overlay */}
      <div
        className='fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blue-sm transition-opacity p-4 md:p-0'
        onClick={onClose}
      >
        <div className='relative w-full h-[80vh] md:h-[75vh] flex justify-center'>
          {/*event detail panel*/}
          {/* biome-ignore lint/a11y/useSemanticElements: panel contains nested interactive elements */}
          <div
            role='button'
            tabIndex={0}
            className={`
              absolute rounded-2xl p-6 transition-all duration-500 ease-out bg-white/70 backdrop-blur-md border border-white
              w-[95%] h-[90%] top-1/2 -translate-y-1/2
              md:w-[400px] md:h-[400px] md:left-80 top-1/2 -translate-y-1/2
              ${
                activeLayer === 'details'
                  ? 'z-50 opacity-100 shadow-2xl scale-100 md:scale-105'
                  : 'z-40 opacity-80 md:opacity-85 shadow-lg scale-95 md:scale-100 cursor-pointer hover:opacity-100'
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
            <EventInfoPanel
              roomId={roomId}
              mode={mode}
              onClose={onClose}
              onSuccess={onSuccess}
            />
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
              md:w-[850px] md:h-[calc(100%-40px)] md:right-0 md:left-auto top-1/2 -translate-y-1/2

              ${
                activeLayer === 'chat'
                  ? 'z-50 opacity-100 shadow-2xl scale-100 md:scale-105'
                  : 'z-40 opacity-80 md:opacity-85 shadow-lg scale-95 md:scale-100 cursor-pointer hover:opacity-100'
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
            {/*<ChatPanel roomId={roomId} />*/}
          </div>
        </div>
      </div>
    </>
  );
};
