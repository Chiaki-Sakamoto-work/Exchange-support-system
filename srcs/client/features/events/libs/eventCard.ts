import type { Room } from '@/app/types';
import { formatDate, isEventOngoing } from '@/lib/date';

export type EventCardViewModel = {
  title: string;
  shop: string;
  date: string;
  tags: { id: number; name: string }[];
  participants: string;
  icon?: 'show' | 'edit';
  ownerProfile?: { image?: string; name: string };
  isOngoing: boolean;
};

export const toEventCardViewModel = (room: Room): EventCardViewModel => {
  const owner = room.user_rooms?.find((ur) => ur.is_owner)?.profiles;
  const formattedTags = room.room_tags.map((rt) => ({
    id: rt.tags.id,
    name: rt.tags.name,
  }));

  const ownerProfile = {
    name: owner?.username || '不明',
    image: owner?.avatar_url || undefined,
  };
  return {
    title: room.title,
    shop: room.location_name || '未定',
    date: formatDate(room.event_start_at),
    participants: `${room._count?.user_rooms || room.user_rooms?.length || 0} / ${room.capacity_limit}`,
    tags: formattedTags,
    ownerProfile: ownerProfile,
    isOngoing: isEventOngoing(room.event_start_at),
  };
};
