import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Omni Shift AI — Admin",
  description: "Admin panel for managing the Omni Shift AI tools directory.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
