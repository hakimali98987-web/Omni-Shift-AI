import { Router, type IRouter } from "express";
import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db, categoriesTable, toolsTable } from "@workspace/db";
import {
  ListToolsQueryParams,
  ListToolsResponse,
  ListFeaturedToolsResponse,
  GetToolParams,
  GetToolResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const toolSelection = {
  id: toolsTable.id,
  slug: toolsTable.slug,
  name: toolsTable.name,
  description: toolsTable.description,
  longDescription: toolsTable.longDescription,
  logoUrl: toolsTable.logoUrl,
  websiteUrl: toolsTable.websiteUrl,
  categorySlug: categoriesTable.slug,
  categoryName: categoriesTable.name,
  pricing: toolsTable.pricing,
  featured: toolsTable.featured,
  rating: toolsTable.rating,
  tags: toolsTable.tags,
  createdAt: toolsTable.createdAt,
};

router.get("/tools/featured", async (_req, res): Promise<void> => {
  const rows = await db
    .select(toolSelection)
    .from(toolsTable)
    .innerJoin(categoriesTable, eq(toolsTable.categoryId, categoriesTable.id))
    .where(eq(toolsTable.featured, true))
    .orderBy(desc(toolsTable.rating))
    .limit(8);

  res.json(ListFeaturedToolsResponse.parse(rows));
});

router.get("/tools/:slug", async (req, res): Promise<void> => {
  const params = GetToolParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [tool] = await db
    .select(toolSelection)
    .from(toolsTable)
    .innerJoin(categoriesTable, eq(toolsTable.categoryId, categoriesTable.id))
    .where(eq(toolsTable.slug, params.data.slug));

  if (!tool) {
    res.status(404).json({ error: "Tool not found" });
    return;
  }

  res.json(GetToolResponse.parse(tool));
});

router.get("/tools", async (req, res): Promise<void> => {
  const query = ListToolsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { search, category, pricing, sort, page, limit } = query.data;

  const conditions = [];
  if (search) {
    conditions.push(
      or(
        ilike(toolsTable.name, `%${search}%`),
        ilike(toolsTable.description, `%${search}%`),
      ),
    );
  }
  if (category) {
    conditions.push(eq(categoriesTable.slug, category));
  }
  if (pricing) {
    conditions.push(eq(toolsTable.pricing, pricing));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const orderBy =
    sort === "newest"
      ? desc(toolsTable.createdAt)
      : sort === "name"
        ? asc(toolsTable.name)
        : desc(toolsTable.rating);

  const baseQuery = db
    .select(toolSelection)
    .from(toolsTable)
    .innerJoin(categoriesTable, eq(toolsTable.categoryId, categoriesTable.id));

  const rows = await (whereClause ? baseQuery.where(whereClause) : baseQuery)
    .orderBy(orderBy)
    .limit(limit)
    .offset((page - 1) * limit);

  const countQuery = db
    .select({ count: sql<number>`count(*)`.mapWith(Number) })
    .from(toolsTable)
    .innerJoin(categoriesTable, eq(toolsTable.categoryId, categoriesTable.id));

  const [{ count }] = await (whereClause
    ? countQuery.where(whereClause)
    : countQuery);

  res.json(
    ListToolsResponse.parse({
      items: rows,
      total: count,
      page,
      limit,
    }),
  );
});

export default router;
