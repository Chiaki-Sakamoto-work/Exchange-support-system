export interface ProfileHeaderProps {
  user: {
    username?: string | null;
    email?: string | null;
    user_type?: string | null;
    bio?: string | null;
    allergies?: string[] | null;
    departments?: {
      name: string;
    } | null;
  };
}

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  const tags = [user.user_type, user.bio, user.departments?.name].filter(
    Boolean,
  );

  return (
    <div className='flex flex-col items-center'>
      <div className='w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 relative'>
        {user.username?.charAt(0) || '無'}
      </div>

      <h2 className='text-xl font-bold text-zinc-900'>
        {user.username || '名前未設定'}
      </h2>
      <p className='text-zinc-400 text-sm mb-4'>{user.email}</p>

      <div className='flex gap-2 mb-4'>
        {tags.map((tag) => (
          <span
            key={tag}
            className='px-3 py-1 bg-zinc-950 text-white rounded-full text-xs font-bold'
          >
            {tag}
          </span>
        ))}
      </div>

      {user.allergies && user.allergies.length > 0 && (
        <div className='flex flex-wrap justify-center gap-2 mb-4'>
          {user.allergies.map((allergy: string) => (
            <span
              key={allergy}
              className='px-3 py-1 bg-red-50 text-red-500 border border-red-100 rounded-full text-xs font-bold'
            >
              {allergy} アレルギー
            </span>
          ))}
        </div>
      )}

      <p className='text-center text-sm text-zinc-500 max-w-[280px]'>
        {user.bio || '自己紹介がありません'}
      </p>
    </div>
  );
};
