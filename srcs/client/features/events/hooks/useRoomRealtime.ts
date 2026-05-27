import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export const useRoomRealtime = (roomId: number, onUpdate: () => void) => {
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`room-detail-realtime-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_rooms',
          filter: `room_id=eq.${roomId}`,
        },
        () => {
          console.log(`[RealtimeHook] 部屋 ${roomId} の入退室を検知しました`);
          onUpdate();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, onUpdate]);
};
