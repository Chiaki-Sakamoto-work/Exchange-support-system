// サーバー側で安全にDB操作を行う宣言
'use server';

import type { RoomStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { prisma } from '../../../lib/prisma';

// シードで作ったテストユーザーのID
const MOCK_USER_ID = '11111111-1111-1111-1111-111111111111';
// 自分のユーザーID　ログイン機能ができたら、そこから取得するように変更
const MY_USER_ID = '11111111-1111-1111-1111-111111111111';

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

export async function getEventDetail(roomId: number) {
  try {
    const room = await prisma.rooms.findUnique({
      where: {
        id: roomId,
      },
      // includeで関連するデータも引っ張ってくる
      include: {
        user_rooms: {
          include: {
            profiles: true, // 参加者のプロフィール情報（名前など）も一緒に取得
          },
        },
      },
    });

    // もし予定が削除されていた時の安全装置
    if (!room) {
      return {
        success: false,
        error: 'この予定は削除されたか、存在しません。',
      };
    }

    return { success: true, room };
  } catch (error) {
    console.error('詳細取得エラー:', error);
    return { success: false, error: 'データの取得に失敗しました。' };
  }
}

// 予定の削除（主催者用）
export async function deleteEventAction(roomId: number) {
  try {
    // 🌟 修正1: 部屋を消す前に、まず関連する名簿(user_rooms)を全て削除する！
    await prisma.user_rooms.deleteMany({
      where: { room_id: roomId },
    });

    // その後で、安全に部屋本体を削除
    await prisma.rooms.delete({
      where: { id: roomId },
    });

    // 🌟 修正2: 画面の古い記憶（キャッシュ）を捨てて最新にする
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('削除エラー:', error);
    return { success: false, error: '削除に失敗しました。' };
  }
}

// 参加のキャンセル
export async function cancelParticipationAction(roomId: number) {
  try {
    await prisma.user_rooms.deleteMany({
      where: {
        room_id: roomId,
        user_id: MY_USER_ID,
      },
    });

    // 🌟 追加: キャッシュをクリア
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('キャンセルエラー:', error);
    return { success: false, error: 'キャンセルに失敗しました。' };
  }
}

// 新しく参加する（参加タブ用）
export async function joinEventAction(roomId: number) {
  try {
    await prisma.user_rooms.create({
      data: {
        room_id: roomId,
        user_id: MY_USER_ID,
        is_owner: false,
      },
    });

    // 🌟 追加: キャッシュをクリア
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('参加エラー:', error);
    return { success: false, error: '参加に失敗しました。' };
  }
}

// 予定を作成する
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
        status: 'OPEN' as RoomStatus,
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
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('作成エラー:', error);
    return { success: false, error: '作成に失敗しました' };
  }
}

// 予定を更新する（編集用）
export async function updateEventAction(
  roomId: number,
  formData: {
    title: string;
    datetime: string;
    capacity: number;
    tags: string;
    shop: string;
  },
) {
  try {
    await prisma.rooms.update({
      where: { id: roomId },
      data: {
        title: formData.title,
        description: formData.tags || 'よろしくお願いします！',
        capacity_limit: Number(formData.capacity),
        location_name: formData.shop,
        event_start_at: new Date(formData.datetime),
      },
    });

    revalidatePath('/'); // キャッシュをクリアして画面を更新
    return { success: true };
  } catch (error) {
    console.error('更新エラー:', error);
    return { success: false, error: '更新に失敗しました' };
  }
}

export async function getExploreEvents() {
  try {
    // 1. まず「自分が参加していない」「OPEN」「未来の予定」をDBから取得
    const events = await prisma.rooms.findMany({
      where: {
        status: 'OPEN',
        event_start_at: {
          gte: new Date(), // 今より未来のイベントだけを取得
        },
        user_rooms: {
          none: {
            user_id: MOCK_USER_ID, // 自分が未参加
          },
        },
      },
      include: {
        user_rooms: {
          include: { profiles: true },
        },
      },
      orderBy: {
        event_start_at: 'asc',
      },
    });
    
    const availableEvents = events.filter(
      (event) => event.capacity_limit === null || event.user_rooms.length < event.capacity_limit
    );

    return { success: true, events: availableEvents };
  } catch (error) {
    console.error('未参加イベントの取得エラー:', error);
    return { success: false, error: 'データの取得に失敗しました'};
  }
}
