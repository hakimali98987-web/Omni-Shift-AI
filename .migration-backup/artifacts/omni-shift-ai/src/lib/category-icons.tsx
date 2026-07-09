import {
  PenLine,
  Image,
  Video,
  Music,
  Code2,
  Zap,
  Megaphone,
  MessageSquare,
  BarChart3,
  Palette,
  GraduationCap,
  Headset,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  PenLine,
  Image,
  Video,
  Music,
  Code2,
  Zap,
  Megaphone,
  MessageSquare,
  BarChart3,
  Palette,
  GraduationCap,
  Headset,
};

export function CategoryIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = iconMap[name] ?? Sparkles;
  return <Icon className={className} />;
}
