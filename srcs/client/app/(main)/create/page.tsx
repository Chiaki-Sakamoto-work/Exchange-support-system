import { getHostedEvents } from '@feature/events/actions/eventActions';
import { MyEvents } from '@/features/events/components/MyEvents';

export default async function CreatePage() {
  const events = await getHostedEvents();


  return (
    <MyEvents events={events} />
  );
}
