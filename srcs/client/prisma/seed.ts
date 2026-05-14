import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, RoomStatus } from '@prisma/client';
import { Pool } from 'pg';

// 1. 環境変数からURLを取得
const connectionString = process.env.DATABASE_URL;

// 2. pgのコネクションプールを作成
const pool = new Pool({ connectionString });

// 3. Prisma用のアダプターを作成
const adapter = new PrismaPg(pool);

// 4. クライアントにアダプターを渡して初期化
const prisma = new PrismaClient({ adapter });

// テスト用の固定UUID
const MOCK_USER_ID = '11111111-1111-1111-1111-111111111111';
const OTHER_USER_ID = '22222222-2222-2222-2222-222222222222';

async function main() {
  // 1. 部署の作成
  const devDept = await prisma.departments.create({
    data: { name: '開発部' },
  });
  const salesDept = await prisma.departments.create({
    data: { name: '営業部' },
  });

  // 2. プロフィール（ユーザー）の作成
  await prisma.profiles.create({
    data: {
      id: MOCK_USER_ID,
      email: 'myuser@example.com',
      username: '姫城太一',
      department_id: devDept.id,
      user_type: '一般社員',
      allergies: ['甲殻類'],
    },
  });

  await prisma.profiles.create({
    data: {
      id: OTHER_USER_ID,
      email: 'other@example.com',
      username: '田中さん',
      department_id: salesDept.id,
      user_type: '一般社員',
    },
  });

  // 3. 部屋（予定）の作成：自分が主催の予定（マイ開催）
  const hostedRoom = await prisma.rooms.create({
    data: {
      title: 'プロジェクト打ち上げ（DB版）',
      description: 'お疲れ様でした！',
      capacity_limit: 8,
      location_name: '肉の万世',
      event_start_at: new Date('2026-05-20T19:00:00Z'),
      status: RoomStatus.OPEN,
      user_rooms: {
        create: {
          user_id: MOCK_USER_ID,
          is_owner: true, // 自分が主催
        },
      },
    },
  });

  // 4. 部屋（予定）の作成：他人が主催で、自分が参加する予定（参加予定）
  const joinedRoom = await prisma.rooms.create({
    data: {
      title: 'エンジニア交流会（DB版）',
      description: '他部署との交流',
      capacity_limit: 10,
      location_name: '代官山カフェ',
      event_start_at: new Date('2026-05-18T18:00:00Z'),
      status: RoomStatus.OPEN,
      user_rooms: {
        create: [
          {
            user_id: OTHER_USER_ID,
            is_owner: true, // 田中さんが主催
          },
          {
            user_id: MOCK_USER_ID,
            is_owner: false, // 自分は一般参加
          },
        ],
      },
    },
  });

  console.log('シードデータの投入が完了しました！');
  console.log('マイ開催:', hostedRoom);
  console.log('参加予定:', joinedRoom);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
