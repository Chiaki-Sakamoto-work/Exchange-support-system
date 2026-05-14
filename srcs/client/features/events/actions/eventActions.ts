// サーバー側で安全にDB操作を行う宣言
'use server';

import { RoomStatus } from '@prisma/client';
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

export async function createEvent(formData: {
  title: string;
  datetime: string;
  capacity: number;
  tags: string;
  shop: string;
}) {
  try {
    const newRoom = await prisma.rooms.create({
      data: {
        title: formData.title,
        // tags はDBに専用カラムがないため、一旦 description に保存します
        description: formData.tags || 'よろしくお願いします！',
        capacity_limit: formData.capacity,
        location_name: formData.shop,
        event_start_at: new Date(formData.datetime), // 文字列からDate型へ変換
        status: RoomStatus.OPEN,
        // 同時に、自分を「主催者」として user_rooms に登録する（シードと同じ手法）
        user_rooms: {
          create: {
            user_id: MOCK_USER_ID,
            is_owner: true,
          },
        },
      },
    });

    // newRoomがlintに引っかからないように一時的に記述
    console.log('新しく作成された部屋のID:', newRoom.id);

    return { success: true };
  } catch (error) {
    console.error('作成エラー:', error);
    return { success: false, error: '作成に失敗しました' };
  }
}
