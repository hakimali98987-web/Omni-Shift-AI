import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "accent" | "outline" | "success" | "warning";

const variantClasses: Record<Variant, string> = {
  default: "bg-secondary text-secondary-foreground",
  accent: "bg-accent text-accent-foreground",
  outline: "border border-border text-foreground",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
