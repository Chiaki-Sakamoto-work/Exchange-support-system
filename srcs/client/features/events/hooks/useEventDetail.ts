import type { Room } from '@type';
import { useCallback, useEffect, useState } from 'react';
import { getEventDetail } from '@/features/events/actions/eventActions';
import { useRoomRealtime } from '@/features/events/hooks/useRoomRealtime';

export const useEventDetail = (roomId: number) => {
  const [eventData, setEventData] = useState<Room>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDetail = useCallback(
    async (isBackgroundUpdate = false) => {
      if (!isBackgroundUpdate) {
        setIsLoading(true);
      }
      setError(null);

      const result = await getEventDetail(roomId);

      if (result.success && result.room) {
        setEventData(result.room);
      } else {
        setError(result.error || 'エラーが発生しました');
      }

      if (!isBackgroundUpdate) {
        setIsLoading(false);
      }
    },
    [roomId],
  );

  useEffect(() => {
    loadDetail(false);
  }, [loadDetail]);

  useRoomRealtime(roomId, () => {});

  return { eventData, isLoading, error };
};
