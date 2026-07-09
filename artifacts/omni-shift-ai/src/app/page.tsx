import type { Metadata } from 'next';
import { HomeView } from './_home-view';

export const metadata: Metadata = {
  title: 'Discover the Best AI Tools in One Place',
  description:
    'Explore thousands of AI tools for writing, coding, image generation, video creation, productivity, marketing and more.',
  openGraph: {
    title: 'Discover the Best AI Tools in One Place | Omni Shift AI',
    description:
      'Explore thousands of AI tools for writing, coding, image generation, video creation, productivity, marketing and more.',
  },
};

export default function HomePage() {
  return <HomeView />;
}
