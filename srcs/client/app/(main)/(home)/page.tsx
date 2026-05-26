import type { Metadata } from 'next';
import { EventHome } from '@/features/events/components/EventHome';

export const metadata: Metadata = {
  title: 'Home',
  description: 'ホーム画面',
};

export default function HomePage() {
  return <EventHome />;
}
