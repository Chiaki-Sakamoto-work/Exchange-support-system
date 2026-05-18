import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ProfileHeader } from './ProfileHeader';
import { WelfareStatus } from './WelfareStatus';

export interface UserProfileProps {
  id: string;
  username: string | null; // 💡 「| null」を追加して、nullも受け取れるようにします
  email: string;
  bio?: string | null;
  department_id: number | null;
  user_type: string | null;
  allergies: string[];
  is_support_used: boolean | null;
  departments?: {
    name: string;
  } | null;
}

export const ProfileDashboard = ({ user }: { user: UserProfileProps }) => {
  return (
    <div className='min-h-screen bg-zinc-50 pb-24'>
      {/* 上部タイトル */}
      <div className='p-6'>
        <h1 className='text-xl font-bold text-zinc-900'>のみ会</h1>
      </div>

      <div className='px-4 flex flex-col gap-4'>
        {/* メインカード (ProfileHeaderをラップ) */}
        <div className='bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm border-b-4 border-b-blue-500'>
          <ProfileHeader user={user} />
        </div>

        {/* 福利厚生セクション */}
        <WelfareStatus />

        {/* アクションボタン */}
        <div className='flex flex-col gap-3 mt-2'>
          <Button
            asChild
            variant='default'
            className='w-full py-7 bg-zinc-950 rounded-2xl shadow-lg'
          >
            <Link href='/profile/edit'>
              <span className='mr-2'>📝</span> プロフィールを編集
            </Link>
          </Button>

          <Button
            variant='outline'
            className='w-full py-7 bg-white text-zinc-600 rounded-2xl border-zinc-200'
          >
            <span className='mr-2'>↪</span> ログアウト
          </Button>
        </div>
      </div>
    </div>
  );
};
