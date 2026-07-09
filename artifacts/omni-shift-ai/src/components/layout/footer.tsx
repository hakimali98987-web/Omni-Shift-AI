import { Link } from "wouter";
import { Zap, Mail, Twitter, Github, ArrowUpRight } from "lucide-react";
import { useListCategories } from "@workspace/api-client-react";

export function Footer() {
  const { data: categories } = useListCategories();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/50 bg-background overflow-hidden">
      {/* Subtle top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

      {/* Background decoration */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-violet-500/[0.03] blur-3xl pointer-events-none"
        aria-hidden
      />

      <div className="container mx-auto px-4 md:px-6 pt-16 pb-10 relative">
        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* ── Brand column ── */}
          <div className="sm:col-span-2 lg:col-span-4 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2.5 w-fit group">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-violet-200 dark:shadow-violet-900/40 transition-transform group-hover:scale-105">
                <Zap className="w-4.5 h-4.5 text-white fill-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight">
                Omni Shift <span className="text-violet-600">AI</span>
              </span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              The trusted, fast, no-nonsense directory for AI tools. Find the right tool
              in seconds — curated, categorised, and always up to date.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              <a
                href="#"
                aria-label="Twitter"
                className="w-8 h-8 rounded-full border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/60 transition-colors"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a
                href="#"
                aria-label="GitHub"
                className="w-8 h-8 rounded-full border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/60 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
              <a
                href="#"
                aria-label="Contact"
                className="w-8 h-8 rounded-full border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/60 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* ── Spacer on large screens ── */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* ── Categories column ── */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground mb-5">
              Categories
            </h3>
            <ul className="space-y-3">
              {(categories ?? []).slice(0, 8).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                  >
                    {cat.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Company column ── */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground mb-5">
              Company
            </h3>
            <ul className="space-y-3">
              {[
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Blog", href: "/blog" },
                { label: "Submit a Tool", href: "#" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Legal column ── */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground mb-5">
              Legal
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Cookie Policy", href: "/cookies" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-14 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Omni Shift AI. All Rights Reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built for builders, makers & AI enthusiasts.
          </p>
        </div>
      </div>
    </footer>
  );
}
