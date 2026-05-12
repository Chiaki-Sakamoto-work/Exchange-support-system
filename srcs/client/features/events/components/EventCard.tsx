// カードに渡すデータの型定義
export type EventCardProps = {
  title: string;
  shop: string;
  date: string;
  detail: string;
  colorClass: string;
};

export const EventCard = ({
  title,
  shop,
  date,
  detail,
  colorClass,
}: EventCardProps) => {
  return (
    <div className='bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex justify-between items-center group hover:border-orange-500 dark:hover:border-orange-500 transition-all cursor-pointer'>
      <div className='flex gap-4 items-center'>
        {/* 左側のカラーバー（視覚的なアクセント） */}
        <div className={`w-2 h-12 rounded-full ${colorClass}`} />

        <div>
          <h3 className='font-bold text-lg'>{title}</h3>
          <p className='text-xs text-zinc-500 font-medium'>
            📍 {shop} • 📅 {date}
          </p>
          <p className='text-[10px] text-zinc-400 mt-1 font-bold tracking-wider'>
            {detail}
          </p>
        </div>
      </div>

      {/* 矢印アイコンの代わり（シンプルにテキストで表現） */}
      <div className='text-zinc-300 dark:text-zinc-700 font-bold'>&gt;</div>
    </div>
  );
};
