// カードに渡すデータの型定義
export type EventCardProps = {
  title: string;
  shop: string;
  date: string;
  detail: string;
  owner?: string;
  colorClass: string;
  onClick?: () => void;
};

export const EventCard = ({
  title,
  shop,
  date,
  detail,
  owner,
  colorClass,
  onClick,
}: EventCardProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // スペースで画面がスクロールするのを防ぐ
      onClick?.();
    }
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: デザイン上の理由でdivである必要があるため
    <div
      role='button'
      tabIndex={0}
      aria-label={`${title}の詳細を表示`}
      onKeyDown={handleKeyDown}
      onClick={onClick}
      className='bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex justify-between items-center group hover:border-orange-500 dark:hover:border-orange-500 transition-all cursor-pointer'
    >
      <div className='flex gap-4 items-center'>
        {/* 左側のカラーバー（視覚的なアクセント） */}
        <div className={`w-2 h-12 rounded-full ${colorClass}`} />

        <div>
          <h3 className='font-bold text-lg'>{title}</h3>
          <p className='text-s text-zinc-600 font-medium'>📍 {shop}</p>
          <p className='text-s text-zinc-600 font-medium'>📅 {date}</p>
          <p className='text-s text-zinc-600 font-medium'>{owner}</p>
          <p className='text-xs text-zinc-600 font-medium'>{detail}</p>
        </div>
      </div>

      {/* 矢印アイコンの代わり（シンプルにテキストで表現） */}
      <div className='text-zinc-300 dark:text-zinc-700 font-bold'>&gt;</div>
    </div>
  );
};
