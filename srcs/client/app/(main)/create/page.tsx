import { getHostedEvents } from '@feature/events/actions/eventActions';
import type { Metadata } from 'next';
import { MyEvents } from '@/features/events/components/MyEvents';

export const metadata: Metadata = {
  title: 'My events',
  description: 'My events 画面',
};

export default async function CreatePage() {
  const events = await getHostedEvents();

  return <MyEvents events={events} />;
}
