import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, categoriesTable, toolsTable } from "@workspace/db";
import { GetDirectoryStatsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/stats", async (_req, res): Promise<void> => {
  const [{ totalTools }] = await db
    .select({ totalTools: sql<number>`count(*)`.mapWith(Number) })
    .from(toolsTable);

  const [{ totalCategories }] = await db
    .select({ totalCategories: sql<number>`count(*)`.mapWith(Number) })
    .from(categoriesTable);

  const [{ freeTools }] = await db
    .select({ freeTools: sql<number>`count(*)`.mapWith(Number) })
    .from(toolsTable)
    .where(eq(toolsTable.pricing, "Free"));

  const [{ freemiumTools }] = await db
    .select({ freemiumTools: sql<number>`count(*)`.mapWith(Number) })
    .from(toolsTable)
    .where(eq(toolsTable.pricing, "Freemium"));

  const [{ paidTools }] = await db
    .select({ paidTools: sql<number>`count(*)`.mapWith(Number) })
    .from(toolsTable)
    .where(eq(toolsTable.pricing, "Paid"));

  res.json(
    GetDirectoryStatsResponse.parse({
      totalTools,
      totalCategories,
      freeTools,
      freemiumTools,
      paidTools,
    }),
  );
});

export default router;
