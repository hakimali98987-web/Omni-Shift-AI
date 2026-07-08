import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t py-12 md:py-16 mt-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold text-lg">
                O
              </div>
              <span className="font-bold text-lg tracking-tight">
                Omni Shift AI
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              The trusted, fast, no-nonsense place power users go to find the right AI tool in seconds.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-sm">Directory</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">All Tools</Link></li>
              <li><Link href="/" className="hover:text-foreground transition-colors">Categories</Link></li>
              <li><Link href="/" className="hover:text-foreground transition-colors">Featured</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-sm">Connect</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Submit a Tool</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Omni Shift AI. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
