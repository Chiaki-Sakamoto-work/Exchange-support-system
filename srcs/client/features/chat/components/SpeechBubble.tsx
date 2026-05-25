import { UserAvatar } from '@/features/users/components/UserAvatar';
import type { ChatMessage } from '@/types';

type Props = {
  msg: ChatMessage;
  isMyMessage: boolean;
};

const formatTime = (date: Date | string | null | undefined) => {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';

  const now = new Date();

  // 날짜 비교를 위한 헬퍼 함수 (연, 월, 일만 비교)
  const isSameDate = (date1: Date, date2: Date) =>
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const timeString = d.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isSameDate(d, now)) {
    return `今日 ${timeString}`;
  }

  if (isSameDate(d, yesterday)) {
    return `昨日 ${timeString}`;
  }

  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${month}/${day} ${timeString}`;
};

export const SpeechBubble = ({ msg, isMyMessage }: Props) => {
  const timeString = formatTime(msg.created_at);
  return (
    <div
      className={`flex items-end flex-row gap-1 w-full ${isMyMessage ? 'justify-end' : 'justify-start'}`}
    >
      {!isMyMessage && (
        <div className='shrink-0'>
          <UserAvatar
            className='border'
            size='default'
            imageSrc={msg.profiles?.avatar_url}
            name={msg.profiles?.username}
          />
        </div>
      )}
      <div
        className={`flex flex-col max-w-[75%] ${isMyMessage ? 'items-end' : 'items-start'}`}
      >
        {/* name */}
        {!isMyMessage && (
          <span className='text-xs text-muted-foreground mb-1 ml-1'>
            {msg.profiles?.username}
          </span>
        )}
        <div
          className={`flex items-end gap-1.5 ${
            isMyMessage ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          {/* speech bubble */}
          <div
            className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
              isMyMessage
                ? 'bg-blue-500 text-white rounded-br-sm'
                : 'bg-white/80 border border-zinc-200 text-zinc-800 rounded-bl-sm'
            }`}
          >
            {msg.content}
          </div>

          {/* time */}
          {timeString && (
            <div
              className={`text-[10px] text-muted-foreground pb-0.5 shrink-0 ${
                isMyMessage ? 'text-right' : 'text-left'
              }`}
            >
              {timeString}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
