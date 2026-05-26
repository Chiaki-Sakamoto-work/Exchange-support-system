import { getHostedEvents } from '@feature/events/actions/eventActions';
import { MyEvents } from '@/features/events/components/MyEvents';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My events',
  description: 'My events 画面',
};

export default async function CreatePage() {
  const events = await getHostedEvents();

  return <MyEvents events={events} />;
}
