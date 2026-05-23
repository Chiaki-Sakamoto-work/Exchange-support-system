import { Card, CardContent } from '@/components/ui/Card';
import { UserAvatar } from '@/features/users/components/UserAvatar';

type ProfileAvatarSectionProps = {
  avatarUrl: string | null;
  userName: string;
};

export const ProfileAvatarSection = ({
  avatarUrl,
  userName,
}: ProfileAvatarSectionProps) => {
  return (
    <Card variant='default' className='space-y-2 shadow-none!'>
      <CardContent className='mx-auto'>
        <UserAvatar name={userName || '無'} size='lg' imageSrc={avatarUrl} />
      </CardContent>
    </Card>
  );
};
