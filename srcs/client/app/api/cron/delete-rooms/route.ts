import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  // セキュリティ対策
  const authHeader = request.headers.get('authorization');
  if (
    process.env.NODE_ENV !== 'development' &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const now = new Date();

  // 30日前の日時を計算 (削除用)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    // ==========================================
    // 🔥 フェーズ 1: 【15分ごと】イベント終了の検知とプロフィール即時更新
    // ==========================================
    const expiredRooms = await prisma.rooms.findMany({
      where: {
        event_end_at: { lte: now }, // 終了時間を過ぎている
        status: { in: ['OPEN', 'CLOSED'] }, // まだ完了していない
      },
      include: {
        user_rooms: {
          where: { is_support_applied: true },
          select: { user_id: true },
        },
      },
    });

    if (expiredRooms.length > 0) {
      await prisma.$transaction(async (tx) => {
        for (const room of expiredRooms) {
          // ① 部屋を「開催終了（COMPLETED）」にする
          await tx.rooms.update({
            where: { id: room.id },
            data: { status: 'COMPLETED' },
          });

          // ② 申請していた人のプロフィールを「利用済み」にする
          const userIds = room.user_rooms.map((ur) => ur.user_id);
          if (userIds.length > 0) {
            await tx.profiles.updateMany({
              where: { id: { in: userIds } },
              data: { is_support_used: true },
            });
          }
        }
      });
      console.log(
        `[Cron] ${expiredRooms.length}件のイベントを完了にし、プロフィールを更新しました。`,
      );
    }

    // ==========================================
    // 🧹 フェーズ 2: 【古いデータのみ】30日経過した履歴の完全削除
    // ==========================================
    const deleteTargetRooms = await prisma.rooms.findMany({
      where: {
        status: { in: ['COMPLETED', 'CANCELLED'] },
        updated_at: { lt: thirtyDaysAgo }, // 30日以上前に終わった古いイベント
      },
      select: { id: true },
    });

    const deleteRoomIds = deleteTargetRooms.map((room) => room.id);

    if (deleteRoomIds.length > 0) {
      await prisma.$transaction([
        prisma.messages.deleteMany({
          where: { room_id: { in: deleteRoomIds } },
        }),
        prisma.user_rooms.deleteMany({
          where: { room_id: { in: deleteRoomIds } },
        }),
        prisma.room_tags.deleteMany({
          where: { room_id: { in: deleteRoomIds } },
        }),
        prisma.rooms.deleteMany({ where: { id: { in: deleteRoomIds } } }),
      ]);
      console.log(
        `[Cron] 30日以上経過した ${deleteRoomIds.length}件の古い部屋を完全に削除しました。`,
      );
    }

    return NextResponse.json({
      success: true,
      completedCount: expiredRooms.length,
      deletedCount: deleteRoomIds.length,
    });
  } catch (error) {
    console.error('Cron一括処理エラー:', error);
    return NextResponse.json(
      { success: false, error: '処理に失敗しました' },
      { status: 500 },
    );
  }
}
