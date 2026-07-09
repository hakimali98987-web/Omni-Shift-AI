import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: {
    default: 'Omni Shift AI — Discover the Best AI Tools',
    template: '%s | Omni Shift AI',
  },
  description:
    'Omni Shift AI is a modern directory of AI tools — browse, search, and compare thousands of AI apps by category and pricing.',
  openGraph: {
    type: 'website',
    siteName: 'Omni Shift AI',
    title: 'Omni Shift AI — Discover the Best AI Tools',
    description:
      'Browse, search, and compare the best AI tools by category and pricing.',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
