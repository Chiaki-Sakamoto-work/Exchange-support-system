import { PrismaClient } from '@prisma/client';
import { prisma } from '../lib/prisma';

async function main() {
  console.log('🌱 シードデータの投入を開始します...');

  // --------------------------------------------------
  // 1. 既存データのリセット（依存関係の末端から消す）
  // --------------------------------------------------
  await prisma.room_tags.deleteMany();
  await prisma.user_rooms.deleteMany();
  await prisma.rooms.deleteMany();
  await prisma.tags.deleteMany();
  await prisma.profiles.deleteMany();

  // --------------------------------------------------
  // 2. モックユーザーの作成
  // --------------------------------------------------
  const mockUserId = '11111111-1111-1111-1111-111111111111';
  await prisma.profiles.create({
    data: {
      id: mockUserId,
      email: 'mock@example.com',
      username: 'テストユーザー',
      bio: '開発用のテストユーザーです。',
    },
  });

  // --------------------------------------------------
  // 3. タグマスターの作成
  // --------------------------------------------------
  const tagNames = ['雑談', 'もくもく会', 'ランチ', '飲み会', '初心者歓迎'];
  for (const name of tagNames) {
    await prisma.tags.create({
      data: { name },
    });
  }

  // --------------------------------------------------
  // 4. イベント（rooms）の作成と紐付け
  // --------------------------------------------------
  const today = new Date();

  // イベント①：自分が主催のイベント（募集中）
  await prisma.rooms.create({
    data: {
      title: '週末焼肉ランチ会🥩',
      description: 'みんなで美味しいお肉を食べに行きましょう！',
      capacity_limit: 4,
      location_name: '焼肉 叙々苑',
      event_start_at: new Date(today.setDate(today.getDate() + 3)), // 3日後
      status: 'OPEN',
      // 主催者として自分を紐付け
      user_rooms: {
        create: {
          user_id: mockUserId,
          is_owner: true,
        },
      },
      // タグを紐付け
      room_tags: {
        create: [
          { tags: { connect: { name: 'ランチ' } } },
          { tags: { connect: { name: '雑談' } } },
        ],
      },
    },
  });

  // イベント②：自分が参加者（is_owner: false）のイベント
  await prisma.rooms.create({
    data: {
      title: 'Next.js もくもく開発会',
      description: '各自のプロジェクトを黙々と進める会です。',
      capacity_limit: 10,
      location_name: '渋谷コワーキングスペース',
      event_start_at: new Date(today.setDate(today.getDate() + 5)), // 約1週間後
      status: 'OPEN',
      user_rooms: {
        create: {
          user_id: mockUserId,
          is_owner: false, // 一般参加
        },
      },
      room_tags: {
        create: [
          { tags: { connect: { name: 'もくもく会' } } },
          { tags: { connect: { name: '初心者歓迎' } } },
        ],
      },
    },
  });

  // イベント③：すでに終了したイベント
  await prisma.rooms.create({
    data: {
      title: '第1回 キックオフ飲み会🍻',
      description: 'プロジェクト開始のお疲れ様会でした。',
      capacity_limit: 8,
      location_name: '居酒屋たぬき',
      event_start_at: new Date(today.setDate(today.getDate() - 10)), // 10日前
      status: 'COMPLETED',
      user_rooms: {
        create: {
          user_id: mockUserId,
          is_owner: true,
        },
      },
      room_tags: {
        create: [
          { tags: { connect: { name: '飲み会' } } },
        ],
      },
    },
  });

  console.log('✅ シードデータの投入が完了しました！');
}

main()
  .catch((e) => {
    console.error('❌ シードデータの投入中にエラーが発生しました:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
