import type { Prisma } from '@prisma/client';

export const fullEventInclude = {
  user_rooms: {
    where: { is_owner: true },
    include: { profiles: true },
  },
  // biome-ignore lint/style/useNamingConvention: Prismaの仕様のため無視
  _count: {
    select: { user_rooms: true },
  },
  room_tags: {
    include: { tags: true },
  },
} satisfies Prisma.roomsInclude;

export type Room = Prisma.roomsGetPayload<{
  include: typeof fullEventInclude;
}>;
