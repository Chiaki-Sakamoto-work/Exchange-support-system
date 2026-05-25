import { SkeletonBlock } from '@/components/ui/SkeletonBlock';
import { cn } from '@/lib/utils';

type SpeechBubbleSkeletonProps = {
  isMyMessage?: boolean;
  widthClassName?: string;
};

const chatSkeletonClassName =
  'bg-zinc-300/45 ring-1 ring-zinc-400/10 before:via-white/35';

export const ChatSkeletonBlock = ({ className }: { className?: string }) => (
  <SkeletonBlock className={cn(chatSkeletonClassName, className)} />
);

export const SpeechBubbleSkeleton = ({
  isMyMessage = false,
  widthClassName = 'w-48',
}: SpeechBubbleSkeletonProps) => (
  <div
    className={cn('flex w-full', isMyMessage ? 'justify-end' : 'justify-start')}
  >
    <ChatSkeletonBlock
      className={cn(
        'h-8 max-w-[75%] rounded-2xl',
        isMyMessage ? 'rounded-br-sm' : 'rounded-bl-sm',
        widthClassName,
      )}
    />
  </div>
);
