import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, type RoomStatus } from '@prisma/client';
import { Pool } from 'pg';

// 1. 環境変数からURLを取得
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// テスト用の固定UUID
const MOCK_USER_ID = '11111111-1111-1111-1111-111111111111'; // 自分
const OTHER_USER_ID = '22222222-2222-2222-2222-222222222222'; // 田中さん
const SATO_USER_ID = '33333333-3333-3333-3333-333333333333'; // 佐藤さん

// テスト用の追加ユーザー（一気に作成するためのリスト）
const EXTRA_USERS = [
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: '鈴木さん',
    email: 'suzuki@example.com',
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    name: '高橋さん',
    email: 'takahashi@example.com',
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    name: '渡辺さん',
    email: 'watanabe@example.com',
  },
  {
    id: '77777777-7777-7777-7777-777777777777',
    name: '伊藤さん',
    email: 'ito@example.com',
  },
  {
    id: '88888888-8888-8888-8888-888888888888',
    name: '山本さん',
    email: 'yamamoto@example.com',
  },
  {
    id: '99999999-9999-9999-9999-999999999999',
    name: '中村さん',
    email: 'nakamura@example.com',
  },
];

async function main() {
  console.log('🌱 シードデータの投入を開始します...');

  // 0. お掃除
  await prisma.user_rooms.deleteMany();
  await prisma.rooms.deleteMany();

  // 1. 部署の作成
  let devDept = await prisma.departments.findFirst({
    where: { name: '開発部' },
  });
  if (!devDept)
    devDept = await prisma.departments.create({ data: { name: '開発部' } });

  let salesDept = await prisma.departments.findFirst({
    where: { name: '営業部' },
  });
  if (!salesDept)
    salesDept = await prisma.departments.create({ data: { name: '営業部' } });

  // 2. プロフィール（ユーザー）の作成
  await prisma.profiles.upsert({
    where: { id: MOCK_USER_ID },
    update: {},
    create: {
      id: MOCK_USER_ID,
      email: 'myuser@example.com',
      username: '姫城太一',
      department_id: devDept.id,
      user_type: '一般社員',
    },
  });
  await prisma.profiles.upsert({
    where: { id: OTHER_USER_ID },
    update: {},
    create: {
      id: OTHER_USER_ID,
      email: 'other@example.com',
      username: '田中さん',
      department_id: salesDept.id,
      user_type: '一般社員',
    },
  });
  await prisma.profiles.upsert({
    where: { id: SATO_USER_ID },
    update: {},
    create: {
      id: SATO_USER_ID,
      email: 'sato@example.com',
      username: '佐藤さん',
      department_id: devDept.id,
      user_type: '一般社員',
    },
  });

  // 追加ユーザー6人を一気に作成
  for (const user of EXTRA_USERS) {
    await prisma.profiles.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        email: user.email,
        username: user.name,
        department_id: salesDept.id,
        user_type: '一般社員',
      },
    });
  }

  // ==========================================
  // 3-1. マイ開催（自分が主催）
  // ==========================================
  await prisma.rooms.create({
    data: {
      title: '週末フロントエンドもくもく会',
      description: 'ReactやNext.jsを黙々と書く会です。',
      capacity_limit: 5,
      location_name: '渋谷コワーキング',
      event_start_at: new Date('2026-05-16T13:00:00Z'),
      status: 'OPEN' as RoomStatus,
      user_rooms: { create: { user_id: MOCK_USER_ID, is_owner: true } },
    },
  });

  // ==========================================
  // 3-2. 参加予定（他人が主催、自分も参加）
  // ==========================================
  await prisma.rooms.create({
    data: {
      title: 'エンジニア交流ランチ',
      description: '他部署との交流を深めましょう！',
      capacity_limit: 6,
      location_name: '代官山カフェ',
      event_start_at: new Date('2026-05-18T12:00:00Z'),
      status: 'OPEN' as RoomStatus,
      user_rooms: {
        create: [
          { user_id: OTHER_USER_ID, is_owner: true }, // 田中さんが主催
          { user_id: MOCK_USER_ID, is_owner: false }, // 自分も行く
        ],
      },
    },
  });

  // ==========================================
  // 3-3. 探す用（まだ自分は参加していない）
  // ==========================================

  // 🌟 パターンA：満員の予定（定員4人、すでに4人参加）
  await prisma.rooms.create({
    data: {
      title: '🍣【満員】超人気！予約困難な寿司ランチ',
      description: '予約が取れないお寿司屋さんに行きます！',
      capacity_limit: 4,
      location_name: '銀座 久兵衛',
      event_start_at: new Date('2026-05-28T12:00:00Z'),
      status: 'OPEN' as RoomStatus,
      user_rooms: {
        create: [
          { user_id: EXTRA_USERS[0].id, is_owner: true }, // 鈴木さん(主催)
          { user_id: EXTRA_USERS[1].id, is_owner: false }, // 高橋さん
          { user_id: EXTRA_USERS[2].id, is_owner: false }, // 渡辺さん
          { user_id: EXTRA_USERS[3].id, is_owner: false }, // 伊藤さん
          // 自分は入っていない
        ],
      },
    },
  });

  // 🌟 パターンB：残り1名の予定（定員6人、すでに5人参加）
  await prisma.rooms.create({
    data: {
      title: '🧩【残り1名】脱出ゲーム挑戦者求む！',
      description: 'あと1人でチームが組めます！脱出得意な方歓迎！',
      capacity_limit: 6,
      location_name: '新宿ミステリーサーカス',
      event_start_at: new Date('2026-05-29T14:00:00Z'),
      status: 'OPEN' as RoomStatus,
      user_rooms: {
        create: [
          { user_id: EXTRA_USERS[4].id, is_owner: true }, // 山本さん(主催)
          { user_id: EXTRA_USERS[5].id, is_owner: false }, // 中村さん
          { user_id: OTHER_USER_ID, is_owner: false }, // 田中さん
          { user_id: SATO_USER_ID, is_owner: false }, // 佐藤さん
          { user_id: EXTRA_USERS[0].id, is_owner: false }, // 鈴木さん
          // 5名参加、自分は入っていない
        ],
      },
    },
  });

  // パターンC：普通の余裕がある予定
  await prisma.rooms.create({
    data: {
      title: '⚽️ 初心者歓迎！フットサル大会',
      description: '運動不足解消のためにフットサルやります！',
      capacity_limit: 15,
      location_name: '代々木フットサルコート',
      event_start_at: new Date('2026-05-25T10:00:00Z'),
      status: 'OPEN' as RoomStatus,
      user_rooms: {
        create: [
          { user_id: OTHER_USER_ID, is_owner: true }, // 田中さんが主催
          { user_id: SATO_USER_ID, is_owner: false }, // 佐藤さん
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
  });
