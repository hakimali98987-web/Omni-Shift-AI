import { z } from "zod";

export const faqItemSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

export const toolInputSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  logoUrl: z.string().url("Must be a valid URL").or(z.literal("")),
  description: z.string().min(1, "Short description is required").max(280),
  fullDescription: z.string().default(""),
  categoryId: z.string().uuid("Select a category"),
  pricing: z.enum(["Free", "Freemium", "Paid"]),
  websiteUrl: z.string().url("Must be a valid URL"),
  tags: z.array(z.string().min(1)).default([]),
  features: z.array(z.string().min(1)).default([]),
  pros: z.array(z.string().min(1)).default([]),
  cons: z.array(z.string().min(1)).default([]),
  faq: z.array(faqItemSchema).default([]),
  featured: z.boolean().default(false),
  trending: z.boolean().default(false),
  rating: z.number().min(0).max(5).optional(),
});

export type ToolInputParsed = z.infer<typeof toolInputSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
