import type { Metadata } from 'next';
import { ToolDetailView } from './_tool-view';

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
    title: `${title} — AI Tool`,
    description: `Discover ${title} on Omni Shift AI. Browse features, pricing, pros, cons, and similar alternatives.`,
    openGraph: {
      title: `${title} | Omni Shift AI`,
      description: `Discover ${title} on Omni Shift AI. Browse features, pricing, pros, cons, and similar alternatives.`,
    },
  };
}

export default function ToolPage() {
  return <ToolDetailView />;
}
