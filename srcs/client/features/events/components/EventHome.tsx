'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import {
  type EventHomeModalMode,
  ExploreEventsPanel,
  type JoinedEventsFilter,
  JoinedEventsPanel,
} from './eventHomePanels';
import { RoomInteractiveOverlay } from './RoomInteractiveOverlay';
import { useEventHomeEvents } from './useEventHomeEvents';

type TabMode = 'explore' | 'joined';

export const EventHome = () => {
  const [subTab, setSubTab] = useState<TabMode>('explore');
  const [filter, setFilter] = useState<JoinedEventsFilter>('all');
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [modalMode, setModalMode] = useState<EventHomeModalMode>('explore');
  const { exploreEvents, hostedRooms, isLoading, joinedRooms, refreshEvents } =
    useEventHomeEvents();

  const handleSelectRoom = (roomId: number, mode: EventHomeModalMode) => {
    setSelectedRoomId(roomId);
    setModalMode(mode);
  };

  return (
    <div className='flex h-full min-h-0 flex-col'>
      <Tabs
        value={subTab}
        onValueChange={(val) => setSubTab(val as TabMode)}
        className='flex h-full min-h-0 w-full flex-col'
      >
        <TabsList className='w-full h-[48px] shrink-0'>
          <TabsTrigger value='explore'>募集中</TabsTrigger>
          <TabsTrigger value='joined'>参加予定</TabsTrigger>
        </TabsList>

        <div className='mt-2 grid min-h-0 w-full flex-1 grid-cols-1 grid-rows-1'>
          <TabsContent
            value='explore'
            className='col-start-1 row-start-1 flex min-h-0 flex-col bg-background'
          >
            <ExploreEventsPanel
              events={exploreEvents}
              isLoading={isLoading}
              onSelectRoom={handleSelectRoom}
            />
          </TabsContent>

          <TabsContent
            value='joined'
            className='col-start-1 row-start-1 flex min-h-0 flex-col bg-background'
          >
            <JoinedEventsPanel
              filter={filter}
              hostedRooms={hostedRooms}
              isLoading={isLoading}
              joinedRooms={joinedRooms}
              onFilterChange={setFilter}
              onSelectRoom={handleSelectRoom}
            />
          </TabsContent>
        </div>

        {selectedRoomId !== null && (
          <RoomInteractiveOverlay
            roomId={selectedRoomId}
            mode={modalMode}
            onClose={() => setSelectedRoomId(null)}
            onSuccess={refreshEvents}
          />
        )}
      </Tabs>
    </div>
  );
};
