import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  // グローバル変数の宣言
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// 定数名を db などに変えることで、グローバルの prisma との衝突を避ける
const db = globalThis.prisma ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;
