import { Router, type IRouter } from "express";
import healthRouter from "./health";
import categoriesRouter from "./categories";
import toolsRouter from "./tools";
import statsRouter from "./stats";
import { db } from "@workspace/db";
import { toolsTable, insertToolSchema, categoriesTable, insertCategorySchema } from "@workspace/db";
import { eq, ilike, sql, and, or, desc } from "drizzle-orm";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";

const router: IRouter = Router();

// ==================== CONFIG ====================
const JWT_SECRET = process.env.JWT_SECRET || "omni-shift-secret-key-2024";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@omnishift.ai";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

const uploadsDir = "./uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ==================== MULTER SETUP ====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    ext && mime ? cb(null, true) : cb(new Error("Only images allowed"));
  },
});

// ==================== AUTH MIDDLEWARE ====================
const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// ==================== PUBLIC ROUTES ====================
router.use(healthRouter);
router.use(categoriesRouter);
router.use(toolsRouter);
router.use(statsRouter);

// ==================== ADMIN ROUTES ====================
const adminRouter = Router();

// --- AUTH ---
adminRouter.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ email, role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token, user: { email, role: "admin" } });
  }
  return res.status(401).json({ error: "Invalid credentials" });
});

adminRouter.get("/auth/me", authMiddleware, (req: any, res) => {
  res.json({ user: req.user });
});

// --- STATS ---
adminRouter.get("/stats", authMiddleware, async (req, res) => {
  try {
    const [totalTools] = await db.select({ count: sql<number>`count(*)` }).from(toolsTable);
    const [featuredTools] = await db.select({ count: sql<number>`count(*)` }).from(toolsTable).where(eq(toolsTable.featured, true));
    const [totalCategories] = await db.select({ count: sql<number>`count(*)` }).from(categoriesTable);
    const pricingDistribution = await db.select({ pricing: toolsTable.pricing, count: sql<number>`count(*)` }).from(toolsTable).groupBy(toolsTable.pricing);
    const categoryDistribution = await db.select({ category: categoriesTable.name, count: sql<number>`count(*)` }).from(toolsTable).innerJoin(categoriesTable, eq(toolsTable.categoryId, categoriesTable.id)).groupBy(categoriesTable.name);
    const recentTools = await db.select({ id: toolsTable.id, name: toolsTable.name, logoUrl: toolsTable.logoUrl, createdAt: toolsTable.createdAt }).from(toolsTable).orderBy(desc(toolsTable.createdAt)).limit(5);

    res.json({
      totalTools: Number(totalTools.count),
      featuredTools: Number(featuredTools.count),
      totalCategories: Number(totalCategories.count),
      pricingDistribution,
      categoryDistribution,
      recentTools,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// --- TOOLS ---
adminRouter.get("/tools", authMiddleware, async (req: any, res) => {
  try {
    const { search, category, pricing, featured, page = "1", limit = "10", sortBy = "createdAt", sortOrder = "desc" } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;
    const conditions: any[] = [];
    if (search) conditions.push(or(ilike(toolsTable.name, `%${search}%`), ilike(toolsTable.description, `%${search}%`)));
    if (category) conditions.push(eq(toolsTable.categoryId, parseInt(category)));
    if (pricing) conditions.push(eq(toolsTable.pricing, pricing));
    if (featured !== undefined && featured !== "") conditions.push(eq(toolsTable.featured, featured === "true"));
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const tools = await db.select({
      id: toolsTable.id, slug: toolsTable.slug, name: toolsTable.name, description: toolsTable.description,
      longDescription: toolsTable.longDescription, logoUrl: toolsTable.logoUrl, websiteUrl: toolsTable.websiteUrl,
      categoryId: toolsTable.categoryId, categoryName: categoriesTable.name, pricing: toolsTable.pricing,
      featured: toolsTable.featured, rating: toolsTable.rating, tags: toolsTable.tags,
      launchYear: toolsTable.launchYear, keyFeatures: toolsTable.keyFeatures, pros: toolsTable.pros,
      cons: toolsTable.cons, createdAt: toolsTable.createdAt,
    }).from(toolsTable).leftJoin(categoriesTable, eq(toolsTable.categoryId, categoriesTable.id))
      .where(whereClause).limit(limitNum).offset(offset)
      .orderBy(sortOrder === "asc" ? toolsTable[sortBy] : desc(toolsTable[sortBy]));

    const [totalCount] = await db.select({ count: sql<number>`count(*)` }).from(toolsTable).where(whereClause);

    res.json({ tools, pagination: { page: pageNum, limit: limitNum, total: Number(totalCount.count), totalPages: Math.ceil(Number(totalCount.count) / limitNum) } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch tools" });
  }
});

adminRouter.get("/tools/:id", authMiddleware, async (req, res) => {
  try {
    const [tool] = await db.select().from(toolsTable).where(eq(toolsTable.id, parseInt(req.params.id))).limit(1);
    if (!tool) return res.status(404).json({ error: "Tool not found" });
    res.json(tool);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tool" });
  }
});

adminRouter.post("/tools", authMiddleware, async (req, res) => {
  try {
    if (!req.body.slug && req.body.name) req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const data = insertToolSchema.parse(req.body);
    const [newTool] = await db.insert(toolsTable).values(data).returning();
    res.status(201).json(newTool);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Validation failed" });
  }
});

adminRouter.put("/tools/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [existing] = await db.select().from(toolsTable).where(eq(toolsTable.id, id)).limit(1);
    if (!existing) return res.status(404).json({ error: "Tool not found" });
    if (req.body.name && !req.body.slug) req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const data = insertToolSchema.partial().parse(req.body);
    const [updated] = await db.update(toolsTable).set(data).where(eq(toolsTable.id, id)).returning();
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Update failed" });
  }
});

adminRouter.delete("/tools/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [existing] = await db.select().from(toolsTable).where(eq(toolsTable.id, id)).limit(1);
    if (!existing) return res.status(404).json({ error: "Tool not found" });
    if (existing.logoUrl && existing.logoUrl.startsWith("/uploads/")) {
      const fp = `.${existing.logoUrl}`;
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    }
    await db.delete(toolsTable).where(eq(toolsTable.id, id));
    res.json({ message: "Tool deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete tool" });
  }
});

adminRouter.post("/tools/bulk-delete", authMiddleware, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: "IDs required" });
    const toDelete = await db.select({ logoUrl: toolsTable.logoUrl }).from(toolsTable).where(sql`${toolsTable.id} = ANY(${ids})`);
    toDelete.forEach((t) => { if (t.logoUrl?.startsWith("/uploads/")) { const fp = `.${t.logoUrl}`; if (fs.existsSync(fp)) fs.unlinkSync(fp); } });
    await db.delete(toolsTable).where(sql`${toolsTable.id} = ANY(${ids})`);
    res.json({ message: `${ids.length} tools deleted` });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete tools" });
  }
});

adminRouter.patch("/tools/:id/toggle-featured", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [tool] = await db.select({ featured: toolsTable.featured }).from(toolsTable).where(eq(toolsTable.id, id)).limit(1);
    if (!tool) return res.status(404).json({ error: "Tool not found" });
    const [updated] = await db.update(toolsTable).set({ featured: !tool.featured }).where(eq(toolsTable.id, id)).returning();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update" });
  }
});

// --- CATEGORIES ---
adminRouter.get("/categories", authMiddleware, async (req, res) => {
  try {
    const categories = await db.select({
      id: categoriesTable.id, slug: categoriesTable.slug, name: categoriesTable.name,
      icon: categoriesTable.icon, description: categoriesTable.description, createdAt: categoriesTable.createdAt,
      toolCount: sql<number>`(SELECT COUNT(*) FROM ${toolsTable} WHERE ${toolsTable.categoryId} = ${categoriesTable.id})`,
    }).from(categoriesTable).orderBy(categoriesTable.name);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

adminRouter.post("/categories", authMiddleware, async (req, res) => {
  try {
    if (!req.body.slug && req.body.name) req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const data = insertCategorySchema.parse(req.body);
    const [newCat] = await db.insert(categoriesTable).values(data).returning();
    res.status(201).json(newCat);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Validation failed" });
  }
});

adminRouter.put("/categories/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [existing] = await db.select().from(categoriesTable).where(eq(categoriesTable.id, id)).limit(1);
    if (!existing) return res.status(404).json({ error: "Category not found" });
    if (req.body.name && !req.body.slug) req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const data = insertCategorySchema.partial().parse(req.body);
    const [updated] = await db.update(categoriesTable).set(data).where(eq(categoriesTable.id, id)).returning();
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Update failed" });
  }
});

adminRouter.delete("/categories/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [existing] = await db.select().from(categoriesTable).where(eq(categoriesTable.id, id)).limit(1);
    if (!existing) return res.status(404).json({ error: "Category not found" });
    const [count] = await db.select({ count: sql<number>`count(*)` }).from(toolsTable).where(eq(toolsTable.categoryId, id));
    if (Number(count.count) > 0) return res.status(400).json({ error: `Cannot delete. ${count.count} tools using this category.` });
    await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category" });
  }
});

// --- UPLOAD ---
adminRouter.post("/upload", authMiddleware, (req, res) => {
  upload.single("file")(req, res, (err: any) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const url = `/uploads/${req.file.filename}`;
    res.json({ url, filename: req.file.filename, size: req.file.size });
  });
});

adminRouter.delete("/upload", authMiddleware, (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL required" });
  const fp = `.${url}`;
  if (fs.existsSync(fp)) { fs.unlinkSync(fp); return res.json({ message: "Deleted" }); }
  res.status(404).json({ error: "File not found" });
});

router.use("/admin", adminRouter);

export default router;
