export default function Privacy() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 max-w-2xl">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: June 2026</p>

      <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Overview</h2>
          <p>
            Omni Shift AI ("we", "us", "our") operates a directory of AI tools. This
            policy explains what information we collect when you use the site and how
            we use it.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. Information we collect</h2>
          <p>
            We collect information you voluntarily provide through forms (such as the
            contact form), along with standard technical data like browser type and
            pages visited, used to keep the site working reliably. Preferences such as
            your favorites, bookmarks, and theme choice are stored locally in your
            browser and are never transmitted to our servers.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. How we use information</h2>
          <p>
            We use the information we collect to operate and improve the directory,
            respond to inquiries, and understand how the site is used. We do not sell
            personal information.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Cookies &amp; local storage</h2>
          <p>
            We use browser local storage to remember preferences like your favorited
            and bookmarked tools and your theme setting. These stay on your device and
            can be cleared at any time from your browser settings.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. Third-party links</h2>
          <p>
            Tool listings link out to third-party websites. We are not responsible for
            the privacy practices of those sites — please review their own policies.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">6. Contact</h2>
          <p>
            Questions about this policy can be sent through our{' '}
            <a href="/contact" className="text-violet-600 dark:text-violet-400 underline underline-offset-2">
              contact page
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
