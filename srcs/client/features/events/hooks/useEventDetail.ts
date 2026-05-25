import type { Room } from '@type';
import { useEffect, useState } from 'react';
import { getEventDetail } from '@/features/events/actions/eventActions';

export const useEventDetail = (roomId: number) => {
  const [eventData, setEventData] = useState<Room>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    async function loadDetail() {
      setIsLoading(true);
      setError(null);
      const result = await getEventDetail(roomId);
      if (!isActive) return;
      if (result.success && result.room) {
        setEventData(result.room);
      } else {
        setError(result.error || 'エラーが発生しました');
      }
      setIsLoading(false);
    }
    loadDetail();
    return () => {
      isActive = false;
    };
  }, [roomId]);

  return { eventData, isLoading, error };
};
