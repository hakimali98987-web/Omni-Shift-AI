import type { Metadata } from 'next';
import { CategoryDetailView } from './_category-view';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return {
    title: `${title} AI Tools`,
    description: `Browse the best ${title} AI tools on Omni Shift AI. Compare features, pricing, and ratings.`,
    openGraph: {
      title: `${title} AI Tools | Omni Shift AI`,
      description: `Browse the best ${title} AI tools on Omni Shift AI. Compare features, pricing, and ratings.`,
    },
  };
}

export default function CategoryPage() {
  return <CategoryDetailView />;
}
