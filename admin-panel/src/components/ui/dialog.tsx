"use client";

import { type ReactNode } from "react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Dialog({ open, onClose, title, children }: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl border border-card-border bg-card p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
