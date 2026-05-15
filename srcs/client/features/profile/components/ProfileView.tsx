import { ProfileHeader } from './ProfileHeader';
import { WelfareStatus } from './WelfareStatus';

export const ProfileView = () => {
  // 本来はSupabase等から取得しますが、まずはモックデータで
  const mockUser: UserProfile = {
    name: '田中太郎',
    role: 'エンジニア',
    bio: 'お酒と美味しい料理が大好きです！',
    tags: ['新卒', '開発部'],
    allergies: ['甲殻類 アレルギー', '小麦 アレルギー'],
  };

  return (
    <div className='flex flex-col gap-6'>
      <ProfileHeader user={mockUser} />
      <WelfareStatus />
      
      <div className='flex flex-col gap-3 mt-4'>
        <button className='w-full py-4 bg-zinc-950 text-white rounded-xl font-bold flex items-center justify-center gap-2'>
          <span>📝</span> プロフィールを編集
        </button>
        <button className='w-full py-4 bg-zinc-100 text-zinc-600 rounded-xl font-bold flex items-center justify-center gap-2'>
          <span>↪</span> ログアウト
        </button>
      </div>
    </div>
  );
};
