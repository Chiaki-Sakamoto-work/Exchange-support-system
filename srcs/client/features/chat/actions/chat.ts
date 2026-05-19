'use server';

import { prisma } from '@/lib/prisma';
import { fullMessageInclude } from '@type';

const getMessages = async (roomId: number) => {
  try {
    const message = await prisma.message.findMany({
      where: {
        room_id: roomId
      },
      include: fullMessageInclude,
      orderBy: {
        created_at: 'asc'
      },
    });

    return message;
  } catch (error) {
    console.error('メッセージ取得エラー:', error);
    throw new Error('メッセージ取得に失敗しました');
  }
};

