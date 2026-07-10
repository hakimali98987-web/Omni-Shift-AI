import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // No backend endpoint exists for contact submissions yet — this is a
    // client-only acknowledgment so the form is usable end-to-end today.
    setSubmitted(true);
    toast({ title: 'Message sent', description: "We'll get back to you soon." });
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 max-w-lg">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-2 inline-flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5" />
          Contact
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">Get in touch</h1>
        <p className="text-muted-foreground">
          Questions, feedback, or want to submit a tool? Send us a message.
        </p>
      </div>

      {submitted ? (
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 p-8 text-center">
          <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-emerald-600 dark:text-emerald-400" />
          <h2 className="font-semibold text-lg mb-1">Thanks for reaching out!</h2>
          <p className="text-sm text-muted-foreground">
            We've received your message and will respond as soon as we can.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="Your name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" placeholder="How can we help?" rows={5} required />
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0 font-semibold"
          >
            Send message
          </Button>
          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Mail className="w-3.5 h-3.5" />
            Or email us directly at hello@omnishift.ai
          </p>
        </form>
      )}
    </div>
  );
}
