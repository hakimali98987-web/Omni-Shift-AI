export type Pricing = "Free" | "Freemium" | "Paid";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  description: string;
  fullDescription: string;
  categoryId: string | null;
  categorySlug: string | null;
  categoryName: string | null;
  pricing: Pricing;
  websiteUrl: string;
  tags: string[];
  features: string[];
  pros: string[];
  cons: string[];
  faq: FaqItem[];
  featured: boolean;
  trending: boolean;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export type ToolInput = Omit<
  Tool,
  "id" | "createdAt" | "updatedAt" | "categorySlug" | "categoryName" | "rating" | "categoryId"
> & { rating?: number; categoryId: string };

export interface DashboardStats {
  totalTools: number;
  totalCategories: number;
  featuredTools: number;
  trendingTools: number;
}

export interface AdminSession {
  email: string;
}
