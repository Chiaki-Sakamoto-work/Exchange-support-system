import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// 1. 環境変数からURLを取得
const connectionString = process.env.DATABASE_URL;

// デバッグ用：URLが正しく読み込めているかコンソールに表示（パスワードは隠す）
if (!connectionString) {
  console.error("❌ DATABASE_URL が環境変数に設定されていません。");
} else {
  console.log("📡 接続先:", connectionString.split('@')[1]); 
}

// 2. Prisma 7 + Driver Adapter の設定
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default async function TestPage() {
  try {
    // 接続テスト用のクエリ実行
    const allDepartments = await prisma.departments.findMany();

    return (
      <div style={{ padding: '20px' }}>
        <h1 style={{ color: 'green' }}>✅ DB接続成功（環境変数経由）</h1>
        <p>取得件数: {allDepartments.length} 件</p>
        <pre style={{ background: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>
          {JSON.stringify(allDepartments, null, 2)}
        </pre>
      </div>
    );
  } catch (error: any) {
    console.error("Prisma Error:", error);
    return (
      <div style={{ padding: '20px' }}>
        <h1 style={{ color: 'red' }}>❌ 接続エラー</h1>
        <p>環境変数が正しく設定されているか確認してください。</p>
        <pre style={{ whiteSpace: 'pre-wrap', background: '#fff0f0', padding: '10px' }}>
          {error.message || String(error)}
        </pre>
      </div>
    );
  } finally {
    // 接続を閉じる
    await prisma.$disconnect();
  }
}
