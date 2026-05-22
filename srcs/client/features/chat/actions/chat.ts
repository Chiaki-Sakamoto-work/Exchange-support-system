'use server';

import { fullMessageInclude } from '@type';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

const getMessages = async (roomId: number) => {
  try {
    const message = await prisma.messages.findMany({
      where: {
        room_id: roomId,
      },
      include: fullMessageInclude,
      orderBy: {
        created_at: 'asc',
      },
    });
    return message;
  } catch (error) {
    console.error('メッセージ取得エラー:', error);
    throw new Error('メッセージ取得に失敗しました');
  }
};

const sendMessage = async (roomId: number, content: string) => {
  const supabase = await createClient();
  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('ログインしてください');
    }
    return user;
  };

  try {
    const user = await getUser();
    const newMessage = await prisma.messages.create({
      data: {
        room_id: roomId,
        user_id: user.id,
        content: content,
      },
      include: fullMessageInclude,
    });
    return newMessage;
  } catch (error) {
    console.error('メッセージ送信エラー', error);
    throw new Error('メッセージ送信に失敗しました');
  }
};

const updateMessage = async (messageId: number, newContent: string) => {
  try {
    const updatedMessage = await prisma.messages.update({
      where: {
        id: messageId,
      },
      data: {
        content: newContent,
      },
      include: fullMessageInclude,
    });
    return updatedMessage;
  } catch (error) {
    console.error('メッセージの編集に失敗しました', error);
    throw new Error('メッセージの編集に失敗しました');
  }
};

const deleteMessage = async (messageId: number) => {
  try {
    const deletedMessage = await prisma.messages.delete({
      where: {
        id: messageId,
      },
    });
    return deletedMessage;
  } catch (error) {
    console.error('メッセージが削除できませんでした. ', error);
    throw new Error('メッセージが削除できませんでした. ');
  }
};

export { deleteMessage, getMessages, sendMessage, updateMessage };
