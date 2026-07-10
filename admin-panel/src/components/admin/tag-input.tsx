"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function TagInput({
  values,
  onChange,
  placeholder,
}: {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  function commit() {
    const trimmed = draft.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setDraft("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commit();
    } else if (event.key === "Backspace" && draft === "" && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-2 focus-within:ring-2 focus-within:ring-ring/50">
      {values.map((value, index) => (
        <Badge key={`${value}-${index}`} variant="accent" className="gap-1 pr-1">
          {value}
          <button
            type="button"
            onClick={() => onChange(values.filter((_, i) => i !== index))}
            className="rounded-full p-0.5 hover:bg-black/10"
            aria-label={`Remove ${value}`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        placeholder={placeholder ?? "Type and press Enter"}
        className="min-w-[8rem] flex-1 border-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}
