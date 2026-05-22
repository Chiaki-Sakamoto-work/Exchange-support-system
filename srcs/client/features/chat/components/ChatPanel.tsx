'use client';

import { getMessages, sendMessage } from '@feature/chat/actions/chat';
import type { ChatMessage } from '@type';
import { Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';

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

  // メッセージが更新されたら自動で一番下までスクロール
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // メッセージ送信処理
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setIsSending(true);
    try {
      const newMessage = await sendMessage(roomId, inputText);

      setMessages((prev) => [...prev, newMessage]);
      setInputText('');
    } catch (_error) {
      toast.error('送信に失敗しました');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className='flex flex-col h-full w-full relative'>
      <div className='flex items-center pb-3 border-b border-zinc-200/60 shrink-0'>
        <h3 className='text-lg font-bold text-zinc-800'>チャット</h3>
        <span className='ml-3 px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full'>
          {messages.length}件
        </span>
      </div>

      {/* メッセージタイムライン（スクロールエリア） */}
      <div
        ref={scrollRef}
        className='flex-1 overflow-y-auto py-4 space-y-4 pr-2 scroll-smooth'
      >
        {isLoading ? (
          <div className='text-center text-sm text-zinc-500 mt-4'>
            読み込み中...
          </div>
        ) : messages.length === 0 ? (
          <div className='text-center text-sm text-zinc-500 mt-4'>
            メッセージはまだありません
          </div>
        ) : (
          messages.map((msg) => {
            const isMyMessage = msg.user_id === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex flex-col max-w-[75%] ${isMyMessage ? 'items-end' : 'items-start'}`}
                >
                  {!isMyMessage && (
                    <span className='text-xs text-zinc-500 mb-1 ml-1'>
                      {msg.profiles?.username}
                    </span>
                  )}
                  {/* 吹き出し */}
                  <div
                    className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
                      isMyMessage
                        ? 'bg-blue-500 text-white rounded-br-sm'
                        : 'bg-white/80 border border-zinc-200 text-zinc-800 rounded-bl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ⌨️ 入力フォーム */}
      <form
        onSubmit={handleSendMessage}
        className='pt-3 border-t border-zinc-200/60 mt-auto shrink-0 flex gap-2'
      >
        <Input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder='メッセージを入力...'
          disabled={isSending}
          className='flex-1 bg-white/80 border-zinc-300 focus-visible:ring-blue-500 shadow-sm'
        />
        <Button
          type='submit'
          disabled={isSending || !inputText.trim()}
          size='icon'
          className='bg-blue-600 hover:bg-blue-700 text-white rounded-full shrink-0 shadow-sm transition-all'
        >
          <Send className='h-4 w-4' />
        </Button>
      </form>
    </div>
  );
};
