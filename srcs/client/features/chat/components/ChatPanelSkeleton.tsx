import {
  ChatSkeletonBlock,
  SpeechBubbleSkeleton,
} from './SpeechBubbleSkeleton';

const messageSkeletons = [
  { isMyMessage: false, widthClassName: 'w-52' },
  { isMyMessage: true, widthClassName: 'w-44' },
  { isMyMessage: false, widthClassName: 'w-64' },
  { isMyMessage: true, widthClassName: 'w-56' },
  { isMyMessage: false, widthClassName: 'w-40' },
  { isMyMessage: true, widthClassName: 'w-60' },
  { isMyMessage: false, widthClassName: 'w-48' },
  { isMyMessage: true, widthClassName: 'w-36' },
  { isMyMessage: false, widthClassName: 'w-56' },
  { isMyMessage: true, widthClassName: 'w-48' },
  { isMyMessage: false, widthClassName: 'w-44' },
  { isMyMessage: true, widthClassName: 'w-52' },
];

export const ChatPanelSkeleton = () => (
  <div
    aria-busy='true'
    className='flex flex-col h-full w-full relative animate-in fade-in duration-300'
  >
    <span className='sr-only'>読み込み中</span>
    <div className='flex items-center pb-3 border-b border-muted/60 shrink-0'>
      <ChatSkeletonBlock className='h-6 w-20 rounded-md' />
      <ChatSkeletonBlock className='ml-3 h-5 w-12 rounded-full' />
    </div>

    <div
      className='flex-1 overflow-y-hidden py-4 space-y-3 pr-2'
      aria-hidden='true'
    >
      {messageSkeletons.map((message, index) => (
        <SpeechBubbleSkeleton
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows are static placeholders
          key={index}
          isMyMessage={message.isMyMessage}
          widthClassName={message.widthClassName}
        />
      ))}
    </div>

    <div className='pt-3 border-t border-muted mt-auto shrink-0 flex gap-2 items-center'>
      <ChatSkeletonBlock className='h-11 flex-1 rounded-md' />
      <ChatSkeletonBlock className='size-11 shrink-0 rounded-md' />
    </div>
  </div>
);
