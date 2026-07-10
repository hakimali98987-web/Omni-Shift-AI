import { Zap, Compass, ShieldCheck, Users } from 'lucide-react';

const VALUES = [
  {
    icon: Compass,
    title: 'Curated, not crawled',
    description:
      'Every tool in the directory is reviewed before it is listed — we favor quality over sheer volume.',
  },
  {
    icon: ShieldCheck,
    title: 'Honest pricing labels',
    description:
      'We clearly mark tools as Free, Freemium, or Paid so you never get surprised at checkout.',
  },
  {
    icon: Users,
    title: 'Built for builders',
    description:
      'Omni Shift AI exists to help makers, marketers, and teams find the right tool fast — not to sell ads.',
  },
];

export default function About() {
  return (
    <div>
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-20 text-center max-w-2xl">
        <div className="w-12 h-12 mx-auto mb-6 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
          <Zap className="w-6 h-6 text-white fill-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
          About Omni Shift AI
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Omni Shift AI is the trusted, fast, no-nonsense directory for AI tools. We help
          people find the right tool in seconds — curated, categorised, and always up to
          date — instead of scrolling through endless "top 100" listicles.
        </p>
      </section>

      <section className="bg-muted/30 border-y border-border/40 py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl">
          {VALUES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="text-center sm:text-left">
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 mx-auto sm:mx-0">
                <Icon className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-lg mb-2">{title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-16 md:py-20 max-w-2xl text-center">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Our story</h2>
        <p className="text-muted-foreground leading-relaxed">
          We started Omni Shift AI because we were tired of digging through outdated
          listicles to find tools that actually worked. Today the directory covers
          dozens of categories — from writing and coding to image generation and
          productivity — and keeps growing every week.
        </p>
      </section>
    </div>
  );
}
