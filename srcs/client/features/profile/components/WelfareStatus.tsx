export const WelfareStatus = () => {
  return (
    <div className='bg-white dark:bg-zinc-900 p-6 rounded-[24px] shadow-sm border border-zinc-100 dark:border-zinc-800'>
      <div className='flex justify-between items-center mb-4'>
        <div className='flex items-center gap-2'>
          <span className='text-lg'>🪄</span>
          <span className='text-sm font-medium text-zinc-500'>5月の福利厚生制度</span>
        </div>
        <span className='text-[10px] text-zinc-400'>利用状況</span>
      </div>
      
      <div className='flex justify-between items-center p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800'>
        <span className='font-bold text-zinc-800 dark:text-zinc-200'>飲み会補助</span>
        <span className='px-3 py-1 bg-blue-500 text-white text-[10px] rounded-full font-bold'>
          利用済み
        </span>
      </div>
    </div>
  );
};
