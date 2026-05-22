import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  // セキュリティ対策：VercelのCron以外からのアクセスを弾く（ローカル開発時はスルー）
  const authHeader = request.headers.get('authorization');
  if (
    process.env.NODE_ENV !== 'development' &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}` // 🌟 修正：シングルクォートではなくバッククォート(`)で囲む
  ) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // 2時間前の時間を計算
  const twoHoursAgo = new Date();
  twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

  try {
    // 「COMPLETEDに手動変更されたもの」または「開始から2時間以上経過したもの(lt: less than)」を一括削除
    const result = await prisma.rooms.deleteMany({
      where: {
        // biome-ignore lint/style/useNamingConvention: Prismaの仕様のため無視
        OR: [{ status: 'COMPLETED' }, { event_start_at: { lt: twoHoursAgo } }],
      },
    });

    console.log(`[Cron] ${result.count}件の古い部屋を削除しました。`);
    return NextResponse.json({ success: true, count: result.count });
  } catch (error) {
    console.error('Cron削除エラー:', error);
    return NextResponse.json(
      { success: false, error: '削除に失敗しました' },
      { status: 500 },
    );
  }
}
