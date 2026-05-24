'use client';

import type { Room } from '@type';
import { useCallback, useEffect, useState } from 'react';
import {
  getExploreEvents,
  getHostedEvents,
  getJoinedEvents,
} from '../actions/eventActions';

export const useEventHomeEvents = () => {
  const [exploreEvents, setExploreEvents] = useState<Room[]>([]);
  const [hostedRooms, setHostedRooms] = useState<Room[]>([]);
  const [joinedRooms, setJoinedRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const [hosted, joined, exploreRes] = await Promise.all([
        getHostedEvents(),
        getJoinedEvents(),
        getExploreEvents(),
      ]);

      setHostedRooms(hosted || []);
      setJoinedRooms(joined || []);

      if (exploreRes.success) {
        setExploreEvents(exploreRes.events || []);
      }
    } catch (error) {
      console.error('データ取得エラー:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshEvents();
  }, [refreshEvents]);

  return {
    exploreEvents,
    hostedRooms,
    isLoading,
    joinedRooms,
    refreshEvents,
  };
};
