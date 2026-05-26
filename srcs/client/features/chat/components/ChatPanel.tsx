'use client';

import { getMessages, sendMessage } from '@feature/chat/actions/chat';
import type { ChatMessage } from '@type';
import { Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';
import { ChatPanelSkeleton } from './ChatPanelSkeleton';
import { SpeechBubble } from './SpeechBubble';

type Props = {
  roomId: number;
};

export const ChatPanel = ({ roomId }: Props) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 初回マウント時にメッセージを取得する
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getMessages(roomId);
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setCurrentUserId(user.id);
        }
        setMessages(data);
      } catch (_error) {
        toast.error('メッセージの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, [roomId]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          const rawMessage = payload.new;

          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', rawMessage.user_id)
            .single();

          const newMessage = {
            ...rawMessage,
            profiles: profile,
          } as ChatMessage;

          setMessages((prev) => {
            const isExist = prev.some((msg) => msg.id === newMessage.id);

            if (isExist) return prev;
            return [...prev, newMessage];
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  // メッセージが更新されたら自動で一番下までスクロール
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // メッセージ送信処理
  const handleSendMessage = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const textToSend = inputText;
    if (!textToSend.trim()) return;

    setInputText('');
    setIsSending(true);

    try {
      const newMessage = await sendMessage(roomId, textToSend);

      setMessages((prev) => {
        const isExist = prev.some((msg) => msg.id === newMessage.id);
        if (isExist) return prev;
        return [...prev, newMessage];
      });
    } catch (_error) {
      toast.error('送信に失敗しました');
      setInputText(textToSend);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return <ChatPanelSkeleton />;
  }

  return (
    <div className='flex flex-col h-full w-full relative'>
      <div className='flex items-center pb-3 border-b border-muted/60 shrink-0'>
        <h3 className='text-lg font-bold text-muted-foreground'>チャット</h3>
        <span className='ml-3 px-2 py-0.5 text-xs font-semibold bg-accent/10 text-accent rounded-full'>
          {messages.length}件
        </span>
      </div>

      {/* メッセージタイムライン（スクロールエリア） */}
      <div
        ref={scrollRef}
        className='flex-1 overflow-y-auto py-4 space-y-4 pr-2 scroll-smooth 
                   [&::-webkit-scrollbar]:w-1.5 
                   [&::-webkit-scrollbar-track]:bg-transparent 
                   [&::-webkit-scrollbar-thumb]:bg-zinc-300 
                   dark:[&::-webkit-scrollbar-thumb]:bg-zinc-700 
                   [&::-webkit-scrollbar-thumb]:rounded-full'
      >
        {messages.length === 0 ? (
          <div className='text-center text-sm text-zinc-500 mt-4'>
            メッセージはまだありません
          </div>
        ) : (
          messages.map((msg) => {
            const isMyMessage = msg.user_id === currentUserId;
            return (
              <SpeechBubble key={msg.id} msg={msg} isMyMessage={isMyMessage} />
            );
          })
        )}
      </div>

      {/* ⌨️ 入力フォーム */}
      <form
        onSubmit={handleSendMessage}
        className='pt-3 border-t border-muted mt-auto shrink-0 flex gap-2 items-center'
      >
        <Input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder='メッセージを入力...'
          // disabled={isSending}
          className='flex-1 border-muted focus-visible:ring-accent shadow-sm'
        />
        <Button
          type='submit'
          variant='accent'
          disabled={isSending || !inputText.trim()}
          size='icon-lg'
          className='text-white shrink-0 shadow-sm transition-all'
        >
          <Send className='h-5 w-5' />
        </Button>
      </form>
    </div>
  );
};
