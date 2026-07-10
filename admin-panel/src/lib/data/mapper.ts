import type { Tool, ToolInput } from "@/lib/types";

/** Raw row shape as stored/returned by Supabase (snake_case + join columns). */
export interface ToolRow {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  description: string;
  full_description: string;
  category_id: string | null;
  pricing: string;
  website_url: string;
  tags: string[];
  features: string[];
  pros: string[];
  cons: string[];
  faq: { question: string; answer: string }[];
  featured: boolean;
  trending: boolean;
  rating: number;
  created_at: string;
  updated_at: string;
  categories?: { slug: string; name: string } | { slug: string; name: string }[] | null;
}

export function mapToolRow(row: ToolRow): Tool {
  const category = Array.isArray(row.categories) ? row.categories[0] : row.categories;

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    logoUrl: row.logo_url,
    description: row.description,
    fullDescription: row.full_description,
    categoryId: row.category_id,
    categorySlug: category?.slug ?? null,
    categoryName: category?.name ?? null,
    pricing: row.pricing as Tool["pricing"],
    websiteUrl: row.website_url,
    tags: row.tags ?? [],
    features: row.features ?? [],
    pros: row.pros ?? [],
    cons: row.cons ?? [],
    faq: row.faq ?? [],
    featured: row.featured,
    trending: row.trending,
    rating: row.rating,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toolInputToRow(input: ToolInput) {
  return {
    name: input.name,
    slug: input.slug,
    logo_url: input.logoUrl,
    description: input.description,
    full_description: input.fullDescription,
    category_id: input.categoryId,
    pricing: input.pricing,
    website_url: input.websiteUrl,
    tags: input.tags,
    features: input.features,
    pros: input.pros,
    cons: input.cons,
    faq: input.faq,
    featured: input.featured,
    trending: input.trending,
    ...(input.rating !== undefined ? { rating: input.rating } : {}),
  };
}
