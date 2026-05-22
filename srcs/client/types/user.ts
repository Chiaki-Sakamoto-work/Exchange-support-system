// import type { profiles, room_tags, rooms, user_rooms } from '@prisma/client';

import type { BaseUserType } from '@/features/profile/schemas/profile';

// export type User = profiles;

// export type EventWithDetails = rooms & {
//   user_rooms: (user_rooms & {
//     profiles: profiles | null;
//   })[];
//   room_tags: room_tags[];
//   _count: {
//     user_rooms: number;
//     room_tags: number;
//   };
// };

// export type Participant = EventWithDetails['user_rooms'][number];

export type UserType = BaseUserType | null;
