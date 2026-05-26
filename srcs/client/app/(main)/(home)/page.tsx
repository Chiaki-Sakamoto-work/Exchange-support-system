import { EventHome } from '@/features/events/components/EventHome';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'ホーム画面',
};

export default function HomePage() {
  return <EventHome />;
}
