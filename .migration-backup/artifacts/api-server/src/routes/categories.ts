import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, categoriesTable, toolsTable } from "@workspace/db";
import { ListCategoriesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/categories", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      id: categoriesTable.id,
      slug: categoriesTable.slug,
      name: categoriesTable.name,
      icon: categoriesTable.icon,
      description: categoriesTable.description,
      toolCount: sql<number>`count(${toolsTable.id})`.mapWith(Number),
    })
    .from(categoriesTable)
    .leftJoin(toolsTable, eq(toolsTable.categoryId, categoriesTable.id))
    .groupBy(categoriesTable.id)
    .orderBy(categoriesTable.name);

  res.json(ListCategoriesResponse.parse(rows));
});

export default router;
