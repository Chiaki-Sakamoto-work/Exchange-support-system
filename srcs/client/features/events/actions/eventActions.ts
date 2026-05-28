'use server';

import type { RoomStatus } from '@prisma/client';
import { fullEventInclude } from '@type';
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

// 1. 自分が主催している未完了の予定を取得
export async function getHostedEvents() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  return await prisma.rooms.findMany({
    where: {
      user_rooms: { some: { user_id: user.id, is_owner: true } },
      status: { in: ['OPEN', 'CLOSED'] },
    },
    include: {
      user_rooms: {
        include: {
          profiles: true,
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
    orderBy: { event_start_at: 'asc' },
  });
}

// 2. 自分が参加(is_owner: false)している未完了の予定を取得
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
      status: { in: ['OPEN', 'CLOSED'] },
    },
    include: fullEventInclude,
    orderBy: { event_start_at: 'asc' },
  });
}

// 3. 予定の詳細情報を取得
export async function getEventDetail(roomId: number) {
  try {
    noStore();
    const room = await prisma.rooms.findUnique({
      where: {
        id: roomId,
      },
      include: {
        user_rooms: {
          include: {
            profiles: {
              include: {
                departments: true,
              },
            },
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

// 4. 予定の削除（主催者用）
export async function deleteEventAction(roomId: number, path: string) {
  try {
    await prisma.messages.deleteMany({
      where: { room_id: roomId },
    });
    await prisma.user_rooms.deleteMany({
      where: { room_id: roomId },
    });
    await prisma.rooms.delete({
      where: { id: roomId },
    });

    revalidatePath(path);
    return { success: true };
  } catch (error) {
    console.error('削除エラー:', error);
    return { success: false, error: '削除に失敗しました。' };
  }
}

// 5. 参加のキャンセル
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

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('キャンセルエラー:', error);
    return { success: false, error: 'キャンセルに失敗しました。' };
  }
}

// 6. 新しく参加する（参加タブ用）
export async function joinEventAction(roomId: number) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'ログインが必要です' };

    const room = await prisma.rooms.findUnique({
      where: { id: roomId },
      select: {
        capacity_limit: true,
        // biome-ignore lint/style/useNamingConvention: Prismaの仕様のため無視
        _count: { select: { user_rooms: true } },
      },
    });

    if (
      room &&
      room.capacity_limit !== null &&
      room._count.user_rooms >= room.capacity_limit
    ) {
      await prisma.rooms.update({
        where: { id: roomId },
        data: { status: 'CLOSED' },
      });
      return {
        success: false,
        error: '申し訳ありません、このイベントは満員になりました。',
      };
    }

    await prisma.user_rooms.create({
      data: {
        room_id: roomId,
        user_id: user.id,
        is_owner: false,
      },
    });

    if (
      room &&
      room.capacity_limit !== null &&
      room._count.user_rooms + 1 >= room.capacity_limit
    ) {
      await prisma.rooms.update({
        where: { id: roomId },
        data: { status: 'CLOSED' },
      });
    }

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('参加エラー:', error);
    return { success: false, error: '参加に失敗しました。' };
  }
}

// 7. 予定を作成する
export async function createEvent(formData: {
  title: string;
  datetime: string;
  capacity: number;
  tags: string[];
  shop: string;
  locationAddress: string;
}) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'ログインが必要です' };
    }

    const startAt = new Date(formData.datetime);
    const endAt = new Date(startAt);
    endAt.setHours(endAt.getHours() + 2);

    const newRoom = await prisma.rooms.create({
      data: {
        title: formData.title,
        capacity_limit: formData.capacity,
        location_name: formData.shop,
        location_address: formData.locationAddress,
        event_start_at: startAt,
        event_end_at: endAt,
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
                where: { name: tagName },
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

// 8. 予定を更新する
export async function updateEventAction(
  roomId: number,
  formData: {
    title: string;
    datetime: string;
    capacity: number;
    tags: string[];
    shop: string;
    hostId?: string;
    locationAddress?: string;
  },
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (formData.hostId && formData.hostId !== user?.id) {
      await prisma.user_rooms.updateMany({
        where: {
          room_id: roomId,
          user_id: user?.id,
        },
        data: {
          is_owner: false,
        },
      });

      await prisma.user_rooms.updateMany({
        where: {
          room_id: roomId,
          user_id: formData.hostId,
        },
        data: {
          is_owner: true,
        },
      });
    }

    const startAt = new Date(formData.datetime);
    const endAt = new Date(startAt);
    endAt.setHours(endAt.getHours() + 2);

    await prisma.rooms.update({
      where: { id: roomId },
      data: {
        title: formData.title,
        capacity_limit: Number(formData.capacity),
        location_name: formData.shop,
        location_address: formData.locationAddress,
        event_start_at: startAt,
        event_end_at: endAt,
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

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('更新エラー:', error);
    return { success: false, error: '更新に失敗しました' };
  }
}

// 9. まだ参加していない予定を取得する（イベントを探すタブ用）
export async function getExploreEvents() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const events = await prisma.rooms.findMany({
      where: {
        status: 'OPEN',
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
    console.error('未参加予定の取得エラー:', error);
    return { success: false, error: 'データの取得に失敗しました' };
  }
}

// 10. 部署一覧の取得
export async function getDepartments() {
  return await prisma.departments.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      id: 'asc',
    },
  });
}

// 11. 交流支援制度フラグの切り替え
export async function toggleSupportAction(roomId: number, isUsed: boolean) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'ログインが必要です' };

    if (isUsed) {
      const profile = await prisma.profiles.findUnique({
        where: { id: user.id },
        select: { is_support_used: true },
      });

      if (profile?.is_support_used) {
        return {
          success: false,
          error: 'すでに制度を利用済みのため、ONにできません',
        };
      }

      const otherApplication = await prisma.user_rooms.findFirst({
        where: {
          user_id: user.id,
          is_support_applied: true,
          room_id: { not: roomId },
          rooms: { status: { in: ['OPEN', 'CLOSED'] } },
        },
      });

      if (otherApplication) {
        return {
          success: false,
          error: '他のイベントで申請中です。複数同時にONにはできません。',
        };
      }
    }

    await prisma.user_rooms.update({
      where: {
        user_id_room_id: {
          user_id: user.id,
          room_id: roomId,
        },
      },
      data: {
        is_support_applied: isUsed,
      },
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('制度利用フラグ更新エラー:', error);
    return { success: false, error: '更新に失敗しました' };
  }
}
