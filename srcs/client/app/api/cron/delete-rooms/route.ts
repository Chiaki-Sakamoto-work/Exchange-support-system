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

  const twoHoursAgo = new Date();
  twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

  try {
    const targetRooms = await prisma.rooms.findMany({
      where: {
        // biome-ignore lint/style/useNamingConvention: Prismaの仕様のため無視
        OR: [{ status: 'COMPLETED' }, { event_start_at: { lt: twoHoursAgo } }],
      },
      select: { id: true }, // IDだけ取得
    });

    // IDを配列にまとめる (例: [1, 2, 5])
    const roomIds = targetRooms.map((room) => room.id);

    // 削除対象がなければここで終了
    if (roomIds.length === 0) {
      console.log('[Cron] 削除対象の古い部屋はありませんでした。');
      return NextResponse.json({ success: true, count: 0 });
    }

    // 「トランザクション」を使って、子データ → 親データの順に一気に消す
    await prisma.$transaction([
      // ① その部屋に紐づく参加者リストをすべて削除
      prisma.user_rooms.deleteMany({
        where: { room_id: { in: roomIds } },
      }),
      // ② その部屋に紐づくタグ付けデータをすべて削除
      prisma.room_tags.deleteMany({
        where: { room_id: { in: roomIds } },
      }),
      // ③ 最後に部屋本体を安全に削除！
      prisma.rooms.deleteMany({
        where: { id: { in: roomIds } },
      }),
    ]);

    console.log(
      `[Cron] ${roomIds.length}件の古い部屋と関連データを削除しました。`,
    );
    return NextResponse.json({ success: true, count: roomIds.length });
  } catch (error) {
    console.error('Cron削除エラー:', error);
    return NextResponse.json(
      { success: false, error: '削除に失敗しました' },
      { status: 500 },
    );
  }
}
