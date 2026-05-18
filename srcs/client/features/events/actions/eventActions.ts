'use server';

import type { RoomStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { fullEventInclude } from '@/app/types';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export async function getHostedEvents() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  return await prisma.rooms.findMany({
    where: {
      user_rooms: { some: { user_id: user.id, is_owner: true } },
    },
    include: fullEventInclude,
    orderBy: { event_start_at: 'asc' },
  });
}

// 2. 自分が参加(is_owner: false)のイベントを取得
export async function getJoinedEvents() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log('⚠️ ログインユーザーが見つかりません');
    return [];
  }
  return await prisma.rooms.findMany({
    where: {
      user_rooms: { some: { user_id: user.id, is_owner: false } },
    },
    include: fullEventInclude,
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
        room_tags: {
          include: {
            tags: true,
          },
        },
        // biome-ignore lint/style/useNamingConvention: Prismaの仕様のため無視
        _count: {
          select: {
            user_rooms: true,
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
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await prisma.user_rooms.deleteMany({
      where: {
        room_id: roomId,
        user_id: user?.id,
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
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'ログインが必要です' };

    await prisma.user_rooms.create({
      data: {
        room_id: roomId,
        user_id: user.id,
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
  tags: string[];
  shop: string;
}) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'ログインが必要です' };
    }

    const newRoom = await prisma.rooms.create({
      data: {
        title: formData.title,
        capacity_limit: formData.capacity,
        location_name: formData.shop,
        event_start_at: new Date(formData.datetime),
        status: 'OPEN' as RoomStatus,
        user_rooms: {
          create: {
            user_id: user.id,
            is_owner: true,
          },
        },
        room_tags: {
          create: formData.tags.map((tagName) => ({
            tags: {
              connectOrCreate: {
                // 중복 생성을 방지하기 위한 고유 조건 (schema.prisma의 @unique 설정 기준)
                where: { name: tagName },
                // 테이블에 해당 태그가 없을 경우 새로 생성할 데이터
                create: { name: tagName },
              },
            },
          })),
        },
      },
    });

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
    tags: string[];
    shop: string;
  },
) {
  try {
    await prisma.rooms.update({
      where: { id: roomId },
      data: {
        title: formData.title,
        capacity_limit: Number(formData.capacity),
        location_name: formData.shop,
        event_start_at: new Date(formData.datetime),
        room_tags: {
          deleteMany: {},

          create: formData.tags.map((tagName) => ({
            tags: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName },
              },
            },
          })),
        },
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
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const events = await prisma.rooms.findMany({
      where: {
        status: 'OPEN',
        event_start_at: {
          gte: new Date(),
        },
        user_rooms: {
          none: {
            user_id: user?.id,
          },
        },
      },
      include: {
        user_rooms: {
          include: { profiles: true },
        },
        room_tags: {
          include: { tags: true },
        },
        // biome-ignore lint/style/useNamingConvention: Prismaの仕様のため無視
        _count: {
          select: { user_rooms: true },
        },
      },
      // 👆 여기까지 수정
      orderBy: {
        event_start_at: 'asc',
      },
    });

    const availableEvents = events.filter(
      (event) =>
        event.capacity_limit === null ||
        event.user_rooms.length < event.capacity_limit,
    );

    return { success: true, events: availableEvents };
  } catch (error) {
    console.error('未参加イベントの取得エラー:', error);
    return { success: false, error: 'データの取得に失敗しました' };
  }
}
