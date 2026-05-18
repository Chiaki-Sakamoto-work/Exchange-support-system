import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, type RoomStatus } from '@prisma/client';
import { Pool } from 'pg';

// ==================================================
// 1. DB接続のセットアップ（成功した安全な方式）
// ==================================================
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ==================================================
// 2. テスト用データの定義
// ==================================================
const MOCK_USER_ID = '11111111-1111-1111-1111-111111111111'; // 自分
const OTHER_USER_ID = '22222222-2222-2222-2222-222222222222'; // 田中さん
const SATO_USER_ID = '33333333-3333-3333-3333-333333333333'; // 佐藤さん

const EXTRA_USERS = [
  { id: '44444444-4444-4444-4444-444444444444', name: '鈴木さん', email: 'suzuki@example.com' },
  { id: '55555555-5555-5555-5555-555555555555', name: '高橋さん', email: 'takahashi@example.com' },
  { id: '66666666-6666-6666-6666-666666666666', name: '渡辺さん', email: 'watanabe@example.com' },
  { id: '77777777-7777-7777-7777-777777777777', name: '伊藤さん', email: 'ito@example.com' },
  { id: '88888888-8888-8888-8888-888888888888', name: '山本さん', email: 'yamamoto@example.com' },
  { id: '99999999-9999-9999-9999-999999999999', name: '中村さん', email: 'nakamura@example.com' },
];

async function main() {
  console.log('🌱 シードデータの投入を開始します...');

  // --------------------------------------------------
  // お掃除（タグの中間テーブルなども追加）
  // --------------------------------------------------
  await prisma.room_tags.deleteMany();
  await prisma.user_rooms.deleteMany();
  await prisma.rooms.deleteMany();
  await prisma.tags.deleteMany();

  // --------------------------------------------------
  // 部署の作成
  // --------------------------------------------------
  let devDept = await prisma.departments.findFirst({ where: { name: '開発部' } });
  if (!devDept) devDept = await prisma.departments.create({ data: { name: '開発部' } });

  let salesDept = await prisma.departments.findFirst({ where: { name: '営業部' } });
  if (!salesDept) salesDept = await prisma.departments.create({ data: { name: '営業部' } });

  // --------------------------------------------------
  // プロフィール（ユーザー）の作成（upsertで安全に）
  // --------------------------------------------------
  const usersToCreate = [
    { id: MOCK_USER_ID, email: 'myuser@example.com', username: '姫城太一', department_id: devDept.id },
    { id: OTHER_USER_ID, email: 'other@example.com', username: '田中さん', department_id: salesDept.id },
    { id: SATO_USER_ID, email: 'sato@example.com', username: '佐藤さん', department_id: devDept.id },
    ...EXTRA_USERS.map(u => ({ id: u.id, email: u.email, username: u.name, department_id: salesDept.id }))
  ];

  for (const u of usersToCreate) {
    await prisma.profiles.upsert({
      where: { id: u.id },
      update: {},
      create: { ...u, user_type: '一般社員' },
    });
  }

  // --------------------------------------------------
  // タグマスターの作成
  // --------------------------------------------------
  const tagNames = ['雑談', 'もくもく会', 'ランチ', '飲み会', '初心者歓迎'];
  for (const name of tagNames) {
    await prisma.tags.create({ data: { name } });
  }

  // --------------------------------------------------
  // イベント（rooms）の作成と紐付け
  // --------------------------------------------------
  const today = new Date();

  // 🌟 パターン1: 自分が主催のイベント（タグ付き）
  await prisma.rooms.create({
    data: {
      title: '週末焼肉ランチ会🥩',
      description: 'みんなで美味しいお肉を食べに行きましょう！',
      capacity_limit: 4,
      location_name: '焼肉 叙々苑',
      event_start_at: new Date(today.setDate(today.getDate() + 3)),
      status: 'OPEN' as RoomStatus,
      user_rooms: { create: { user_id: MOCK_USER_ID, is_owner: true } },
      room_tags: {
        create: [{ tags: { connect: { name: 'ランチ' } } }, { tags: { connect: { name: '雑談' } } }],
      },
    },
  });

  // 🌟 パターン2: 自分が参加者（一般参加）のイベント（タグ付き）
  await prisma.rooms.create({
    data: {
      title: 'Next.js もくもく開発会',
      description: '各自のプロジェクトを黙々と進める会です。',
      capacity_limit: 10,
      location_name: '渋谷コワーキング',
      event_start_at: new Date(today.setDate(today.getDate() + 5)),
      status: 'OPEN' as RoomStatus,
      user_rooms: {
        create: [
          { user_id: OTHER_USER_ID, is_owner: true }, // 田中さん主催
          { user_id: MOCK_USER_ID, is_owner: false }, // 自分も参加
        ],
      },
      room_tags: {
        create: [{ tags: { connect: { name: 'もくもく会' } } }, { tags: { connect: { name: '初心者歓迎' } } }],
      },
    },
  });

  // 🌟 パターン3: すでに終了した過去のイベント
  await prisma.rooms.create({
    data: {
      title: '第1回 キックオフ飲み会🍻',
      description: 'プロジェクト開始のお疲れ様会でした。',
      capacity_limit: 8,
      location_name: '居酒屋たぬき',
      event_start_at: new Date(today.setDate(today.getDate() - 15)), // 15日前
      status: 'COMPLETED' as RoomStatus,
      user_rooms: { create: { user_id: MOCK_USER_ID, is_owner: true } },
      room_tags: {
        create: [{ tags: { connect: { name: '飲み会' } } }],
      },
    },
  });

  // 🌟 パターン4: 満員の予定（探すタブのテスト用）
  await prisma.rooms.create({
    data: {
      title: '🍣【満員】超人気！予約困難な寿司ランチ',
      description: '予約が取れないお寿司屋さんに行きます！',
      capacity_limit: 4,
      location_name: '銀座 久兵衛',
      event_start_at: new Date(today.setDate(today.getDate() + 10)),
      status: 'OPEN' as RoomStatus,
      user_rooms: {
        create: [
          { user_id: EXTRA_USERS[0].id, is_owner: true },
          { user_id: EXTRA_USERS[1].id, is_owner: false },
          { user_id: EXTRA_USERS[2].id, is_owner: false },
          { user_id: EXTRA_USERS[3].id, is_owner: false },
        ],
      },
    },
  });

  // 🌟 パターン5: 残り1名の予定（探すタブのテスト用）
  await prisma.rooms.create({
    data: {
      title: '🧩【残り1名】脱出ゲーム挑戦者求む！',
      description: 'あと1人でチームが組めます！脱出得意な方歓迎！',
      capacity_limit: 6,
      location_name: '新宿ミステリーサーカス',
      event_start_at: new Date(today.setDate(today.getDate() + 11)),
      status: 'OPEN' as RoomStatus,
      user_rooms: {
        create: [
          { user_id: EXTRA_USERS[4].id, is_owner: true },
          { user_id: EXTRA_USERS[5].id, is_owner: false },
          { user_id: OTHER_USER_ID, is_owner: false },
          { user_id: SATO_USER_ID, is_owner: false },
          { user_id: EXTRA_USERS[0].id, is_owner: false },
        ],
      },
    },
  });

  console.log('✅ シードデータの投入が完了しました！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end(); // 💡 pgのプールも明示的に閉じる
  });
