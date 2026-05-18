'use client';

import { useRouter } from 'next/navigation';
import { EventForm } from '@/features/events/components/EventForm';

export default function CreatePage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/');
    router.refresh();
  };

  return (
    // <div className='p-6'>
    <EventForm onSuccess={handleSuccess} />
    // </div>
  );
}
