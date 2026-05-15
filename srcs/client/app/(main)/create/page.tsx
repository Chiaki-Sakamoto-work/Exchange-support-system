import { EventCreateForm } from '@/features/events/components/EventCreateForm';

export default function EventCreatePage() {
  return (
    <div>
      <h2 className='text-xl font-bold mb-6'>イベントを作成</h2>
      <EventCreateForm />
    </div>
  );
}
