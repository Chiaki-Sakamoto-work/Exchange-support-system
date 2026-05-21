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

const sendMessage = async (roomId: number, userId: string, content: string) => {
  try {
    const newMessage = await prisma.message.create({
      data: {
        room_id: roomId,
        user_id: userId,
        content: content,
      },
      include: fullMessageInclude
    });
    return newMessage;
  } catch (error) {
    console.error('メッセージ送信エラー', error);
    throw new Error('メッセージ送信に失敗しました');
  }
};

const updateMessage = async (messageId: number, newContent: string) => {
  try {
    updateMessage = await prisma.message.update({
      where: {
        id: messageId
      },
      data: {
        content: newContent,
      },
      include: fullMessageInclude
    });
    return updateMessage;
  } chatch (error) {
    console.error('メッセージの編集に失敗しました', error);
    throw new ERROR('メッセージの編集に失敗しました');
  }
};

const deleteMessage = async (messageId: number) => {
  try {
    delteMessage = await prisma.message.delete({
      where: {
        id: messageId
      },
    });
    return deleteMessage;
  } chatch (error) {
    console.error('メッセージが削除できませんでした. ', error);
    throw new ERROR('メッセージが削除できませんでした. ');
  }
};

