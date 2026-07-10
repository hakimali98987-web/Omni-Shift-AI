"use client";

import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { FaqItem } from "@/lib/types";

export function FaqEditor({
  items,
  onChange,
}: {
  items: FaqItem[];
  onChange: (items: FaqItem[]) => void;
}) {
  function update(index: number, field: keyof FaqItem, value: string) {
    onChange(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="space-y-2 rounded-lg border border-border p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Question {index + 1}</span>
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-muted-foreground hover:text-destructive"
              aria-label="Remove FAQ item"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <Input
            value={item.question}
            onChange={(e) => update(index, "question", e.target.value)}
            placeholder="e.g. Does this tool offer a free plan?"
          />
          <Textarea
            value={item.answer}
            onChange={(e) => update(index, "answer", e.target.value)}
            placeholder="Answer"
            className="min-h-16"
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...items, { question: "", answer: "" }])}
      >
        <Plus className="h-4 w-4" />
        Add FAQ item
      </Button>
    </div>
  );
}
