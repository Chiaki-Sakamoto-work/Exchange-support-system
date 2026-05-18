'use client';

import { useRouter } from 'next/navigation';
import { EventCreateForm } from '@/features/events/components/EventCreateForm';

export default function CreatePage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/');
    router.refresh();
  };

  return (
    <div className='p-6'>
      <EventCreateForm onSuccess={handleSuccess} />
    </div>
  );
}
