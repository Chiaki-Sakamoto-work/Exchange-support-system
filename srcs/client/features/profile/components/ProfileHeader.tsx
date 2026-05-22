import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { UserAvatar } from '@/features/users/components/UserAvatar';
import { isStringNewRecruit } from '@/features/users/lib/profile';

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
    avatar_url?: string | null;
  };
}

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  return (
    <Card className='shadow-none!'>
      <CardContent>
        <div className='flex flex-col items-center'>
          <UserAvatar
            size='lg'
            imageSrc={user.avatar_url}
            name={user.username}
          />

          <h2 className='text-xl font-bold text-zinc-900'>
            {user.username || '名前未設定'}
          </h2>

          <p className='text-zinc-400 text-sm mb-4'>{user.email}</p>
          <p className='text-center text-sm text-foreground'>
            {user.bio || '自己紹介がありません'}
          </p>

          <div className='flex gap-2 mb-4 mt-2'>
            {user.user_type && (
              <Badge
                variant={
                  isStringNewRecruit(user.user_type) ? 'primary' : 'secondary'
                }
              >
                {user.user_type}
              </Badge>
            )}

            {user.departments?.name && (
              <Badge variant='secondary'>{user.departments?.name}</Badge>
            )}
          </div>

          {user.allergies && user.allergies.length > 0 && (
            <div className='flex flex-wrap justify-center gap-2 mb-4'>
              {user.allergies.map((allergy: string) => (
                <Badge
                  key={allergy}
                  className='bg-destructive/[0.08] text-destructive'
                >
                  {allergy} アレルギー
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
