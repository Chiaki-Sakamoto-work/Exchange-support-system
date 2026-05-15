export const ProfileHeader = ({ user }: { user: UserProfile }) => (
  <div className='bg-white dark:bg-zinc-900 p-8 rounded-[32px] flex flex-col items-center text-center shadow-sm'>
    <div className='w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center text-white text-3xl mb-4'>
      田
    </div>
    <h2 className='text-2xl font-bold mb-1'>{user.name}</h2>
    <p className='text-zinc-500 text-sm mb-4 leading-relaxed'>
      {user.role}です。{user.bio}
    </p>
    <div className='flex gap-2 mb-4'>
      {user.tags.map(tag => (
        <span key={tag} className='px-3 py-1 bg-zinc-100 rounded-full text-xs font-medium'>{tag}</span>
      ))}
    </div>
    <div className='flex gap-2'>
      {user.allergies.map(all => (
        <span key={all} className='px-3 py-1 bg-red-50 text-red-500 rounded-full text-xs font-medium'>{all}</span>
      ))}
    </div>
  </div>
);

