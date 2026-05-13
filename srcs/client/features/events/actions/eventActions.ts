// サーバー側で安全にDB操作を行う宣言
'use server';

import { prisma } from '../../../lib/prisma';

// シードで作ったテストユーザーのID
const MOCK_USER_ID = '11111111-1111-1111-1111-111111111111';

// 1. 自分が主催(is_owner: true)のイベントを取得
export async function getHostedEvents() {
  return await prisma.rooms.findMany({
    where: {
      user_rooms: {
        some: { user_id: MOCK_USER_ID, is_owner: true },
      },
    },
    include: {
      // biome-ignore lint/style/useNamingConvention: Prismaの仕様のため無視
      _count: {
        select: { user_rooms: true },
      },
    },
    orderBy: { event_start_at: 'asc' },
  });
}

// 2. 自分が参加(is_owner: false)のイベントを取得
export async function getJoinedEvents() {
  return await prisma.rooms.findMany({
    where: {
      user_rooms: {
        some: { user_id: MOCK_USER_ID, is_owner: false },
      },
    },
    include: {
      // 主催者の名前も出す
      user_rooms: {
        where: { is_owner: true },
        include: { profiles: true },
      },
      // biome-ignore lint/style/useNamingConvention: Prismaの仕様のため無視
      _count: {
        select: { user_rooms: true },
      },
    },
    orderBy: { event_start_at: 'asc' },
  });
}
