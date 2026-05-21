// import cron from 'node-cron';

import { prisma } from './prisma';

export function initAutoDeleteJob() {
  // 5分ごとにデータベースをチェックする設定
//   cron.schedule('*/5 * * * *', async () => {
//     console.log('[Cron] 終了した予定の自動削除チェックを開始します...');

//     try {
//       // 現在時刻から2時間前の基準時間を計算
//       const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

//       // 開始時間が2時間前より古いルームを物理削除
//       const result = await prisma.rooms.deleteMany({
//         where: {
//           event_start_at: {
//             lte: twoHoursAgo,
//           },
//         },
//       });

//       if (result.count > 0) {
//         console.log(`[Cron] ${result.count}件の終了した予定を削除しました。`);
//       }
//     } catch (error) {
//       console.error(
//         '[Cron] 終了した予定の自動削除中にエラーが発生しました:',
//         error,
//       );
//     }
//   });
}
