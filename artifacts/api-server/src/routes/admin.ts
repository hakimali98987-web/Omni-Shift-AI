import { Router } from "express";
import { db } from "@workspace/db";
import { toolsTable, insertToolSchema } from "@workspace/db/schema/tools";
import { categoriesTable, insertCategorySchema } from "@workspace/db/schema/categories";
import { eq, ilike, sql, and, or, desc } from "drizzle-orm";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// ==================== CONFIG ====================
const JWT_SECRET = process.env.JWT_SECRET || "omni-shift-secret-key-2024";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@omnishift.ai";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Ensure uploads folder exists
const uploadsDir = "./uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ==================== FILE UPLOAD SETUP ====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// ==================== AUTH MIDDLEWARE ====================
const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// ==================== AUTH ROUTES ====================
router.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ email, role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({
      token,
      user: { email, role: "admin" },
    });
  }

  return res.status(401).json({ error: "Invalid email or password" });
});

router.get("/auth/me", authMiddleware, (req: any, res) => {
  res.json({ user: req.user });
});

// ==================== DASHBOARD STATS ====================
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const [totalTools] = await db.select({ count: sql<number>`count(*)` }).from(toolsTable);
    const [featuredTools] = await db
      .select({ count: sql<number>`count(*)` })
      .from(toolsTable)
      .where(eq(toolsTable.featured, true));
    const [totalCategories] = await db.select({ count: sql<number>`count(*)` }).from(categoriesTable);

    const pricingDistribution = await db
      .select({
        pricing: toolsTable.pricing,
        count: sql<number>`count(*)`,
      })
      .from(toolsTable)
      .groupBy(toolsTable.pricing);

    const categoryDistribution = await db
      .select({
        category: categoriesTable.name,
        count: sql<number>`count(*)`,
      })
      .from(toolsTable)
      .innerJoin(categoriesTable, eq(toolsTable.categoryId, categoriesTable.id))
      .groupBy(categoriesTable.name);

    const recentTools = await db
      .select({
        id: toolsTable.id,
        name: toolsTable.name,
        logoUrl: toolsTable.logoUrl,
        createdAt: toolsTable.createdAt,
      })
      .from(toolsTable)
      .orderBy(desc(toolsTable.createdAt))
      .limit(5);

    res.json({
      totalTools: Number(totalTools.count),
      featuredTools: Number(featuredTools.count),
      totalCategories: Number(totalCategories.count),
      pricingDistribution,
      categoryDistribution,
      recentTools,
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

// ==================== TOOLS CRUD ====================

// GET all tools (with search, filter, pagination)
router.get("/tools", authMiddleware, async (req: any, res) => {
  try {
    const {
      search,
      category,
      pricing,
      featured,
      page = "1",
      limit = "10",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
    const offset = (pageNum - 1) * limitNum;

    // Build where conditions
    const conditions: any[] = [];

    if (search) {
      conditions.push(
        or(
          ilike(toolsTable.name, `%${search}%`),
          ilike(toolsTable.description, `%${search}%`),
          ilike(toolsTable.slug, `%${search}%`)
        )
      );
    }
    if (category) {
      conditions.push(eq(toolsTable.categoryId, parseInt(category as string)));
    }
    if (pricing) {
      conditions.push(eq(toolsTable.pricing, pricing as string));
    }
    if (featured !== undefined && featured !== "") {
      conditions.push(eq(toolsTable.featured, featured === "true"));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get tools with category name
    const tools = await db
      .select({
        id: toolsTable.id,
        slug: toolsTable.slug,
        name: toolsTable.name,
        description: toolsTable.description,
        longDescription: toolsTable.longDescription,
        logoUrl: toolsTable.logoUrl,
        websiteUrl: toolsTable.websiteUrl,
        categoryId: toolsTable.categoryId,
        categoryName: categoriesTable.name,
        pricing: toolsTable.pricing,
        featured: toolsTable.featured,
        rating: toolsTable.rating,
        tags: toolsTable.tags,
        launchYear: toolsTable.launchYear,
        keyFeatures: toolsTable.keyFeatures,
        pros: toolsTable.pros,
        cons: toolsTable.cons,
        createdAt: toolsTable.createdAt,
      })
      .from(toolsTable)
      .leftJoin(categoriesTable, eq(toolsTable.categoryId, categoriesTable.id))
      .where(whereClause)
      .limit(limitNum)
      .offset(offset)
      .orderBy(
        sortOrder === "asc"
          ? toolsTable[sortBy as keyof typeof toolsTable]
          : desc(toolsTable[sortBy as keyof typeof toolsTable])
      );

    // Total count
    const [totalCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(toolsTable)
      .where(whereClause);

    res.json({
      tools,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: Number(totalCount.count),
        totalPages: Math.ceil(Number(totalCount.count) / limitNum),
      },
    });
  } catch (error) {
    console.error("Fetch tools error:", error);
    res.status(500).json({ error: "Failed to fetch tools" });
  }
});

// GET single tool
router.get("/tools/:id", authMiddleware, async (req, res) => {
  try {
    const [tool] = await db
      .select()
      .from(toolsTable)
      .where(eq(toolsTable.id, parseInt(req.params.id)))
      .limit(1);

    if (!tool) {
      return res.status(404).json({ error: "Tool not found" });
    }

    res.json(tool);
  } catch (error) {
    console.error("Fetch tool error:", error);
    res.status(500).json({ error: "Failed to fetch tool" });
  }
});

// CREATE tool
router.post("/tools", authMiddleware, async (req, res) => {
  try {
    // Auto-generate slug from name if not provided
    if (!req.body.slug && req.body.name) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }

    const data = insertToolSchema.parse(req.body);
    const [newTool] = await db.insert(toolsTable).values(data).returning();

    res.status(201).json(newTool);
  } catch (error: any) {
    console.error("Create tool error:", error);
    if (error?.issues) {
      return res.status(400).json({ error: "Validation failed", details: error.issues });
    }
    res.status(400).json({ error: error.message || "Failed to create tool" });
  }
});

// UPDATE tool
router.put("/tools/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Check if tool exists
    const [existing] = await db.select().from(toolsTable).where(eq(toolsTable.id, id)).limit(1);
    if (!existing) {
      return res.status(404).json({ error: "Tool not found" });
    }

    // Auto-generate slug if name changed and slug not provided
    if (req.body.name && !req.body.slug) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }

    const data = insertToolSchema.partial().parse(req.body);
    const [updated] = await db
      .update(toolsTable)
      .set({ ...data, id }) // id included for where clause but won't be updated
      .where(eq(toolsTable.id, id))
      .returning();

    res.json(updated);
  } catch (error: any) {
    console.error("Update tool error:", error);
    if (error?.issues) {
      return res.status(400).json({ error: "Validation failed", details: error.issues });
    }
    res.status(400).json({ error: error.message || "Failed to update tool" });
  }
});

// DELETE tool
router.delete("/tools/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const [existing] = await db.select().from(toolsTable).where(eq(toolsTable.id, id)).limit(1);
    if (!existing) {
      return res.status(404).json({ error: "Tool not found" });
    }

    // Delete logo file if exists
    if (existing.logoUrl && existing.logoUrl.startsWith("/uploads/")) {
      const filePath = `.${existing.logoUrl}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await db.delete(toolsTable).where(eq(toolsTable.id, id));
    res.json({ message: "Tool deleted successfully" });
  } catch (error) {
    console.error("Delete tool error:", error);
    res.status(500).json({ error: "Failed to delete tool" });
  }
});

// BULK DELETE tools
router.post("/tools/bulk-delete", authMiddleware, async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Please provide an array of tool IDs" });
    }

    // Get tools to delete their logos
    const toolsToDelete = await db
      .select({ logoUrl: toolsTable.logoUrl })
      .from(toolsTable)
      .where(sql`${toolsTable.id} = ANY(${ids})`);

    // Delete logo files
    toolsToDelete.forEach((tool) => {
      if (tool.logoUrl && tool.logoUrl.startsWith("/uploads/")) {
        const filePath = `.${tool.logoUrl}`;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });

    await db.delete(toolsTable).where(sql`${toolsTable.id} = ANY(${ids})`);
    res.json({ message: `${ids.length} tools deleted successfully` });
  } catch (error) {
    console.error("Bulk delete error:", error);
    res.status(500).json({ error: "Failed to delete tools" });
  }
});

// TOGGLE featured status
router.patch("/tools/:id/toggle-featured", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const [tool] = await db.select({ featured: toolsTable.featured }).from(toolsTable).where(eq(toolsTable.id, id)).limit(1);
    if (!tool) {
      return res.status(404).json({ error: "Tool not found" });
    }

    const [updated] = await db
      .update(toolsTable)
      .set({ featured: !tool.featured })
      .where(eq(toolsTable.id, id))
      .returning();

    res.json(updated);
  } catch (error) {
    console.error("Toggle featured error:", error);
    res.status(500).json({ error: "Failed to update tool" });
  }
});

// ==================== CATEGORIES CRUD ====================

// GET all categories
router.get("/categories", authMiddleware, async (req, res) => {
  try {
    const categories = await db
      .select({
        id: categoriesTable.id,
        slug: categoriesTable.slug,
        name: categoriesTable.name,
        icon: categoriesTable.icon,
        description: categoriesTable.description,
        createdAt: categoriesTable.createdAt,
        toolCount: sql<number>`(SELECT COUNT(*) FROM ${toolsTable} WHERE ${toolsTable.categoryId} = ${categoriesTable.id})`,
      })
      .from(categoriesTable)
      .orderBy(categoriesTable.name);

    res.json(categories);
  } catch (error) {
    console.error("Fetch categories error:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// GET single category
router.get("/categories/:id", authMiddleware, async (req, res) => {
  try {
    const [category] = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.id, parseInt(req.params.id)))
      .limit(1);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Fetch category error:", error);
    res.status(500).json({ error: "Failed to fetch category" });
  }
});

// CREATE category
router.post("/categories", authMiddleware, async (req, res) => {
  try {
    // Auto-generate slug from name if not provided
    if (!req.body.slug && req.body.name) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }

    const data = insertCategorySchema.parse(req.body);
    const [newCategory] = await db.insert(categoriesTable).values(data).returning();

    res.status(201).json(newCategory);
  } catch (error: any) {
    console.error("Create category error:", error);
    if (error?.issues) {
      return res.status(400).json({ error: "Validation failed", details: error.issues });
    }
    res.status(400).json({ error: error.message || "Failed to create category" });
  }
});

// UPDATE category
router.put("/categories/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const [existing] = await db.select().from(categoriesTable).where(eq(categoriesTable.id, id)).limit(1);
    if (!existing) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (req.body.name && !req.body.slug) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }

    const data = insertCategorySchema.partial().parse(req.body);
    const [updated] = await db
      .update(categoriesTable)
      .set(data)
      .where(eq(categoriesTable.id, id))
      .returning();

    res.json(updated);
  } catch (error: any) {
    console.error("Update category error:", error);
    if (error?.issues) {
      return res.status(400).json({ error: "Validation failed", details: error.issues });
    }
    res.status(400).json({ error: error.message || "Failed to update category" });
  }
});

// DELETE category
router.delete("/categories/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const [existing] = await db.select().from(categoriesTable).where(eq(categoriesTable.id, id)).limit(1);
    if (!existing) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Check if tools are using this category
    const [toolsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(toolsTable)
      .where(eq(toolsTable.categoryId, id));

    if (Number(toolsCount.count) > 0) {
      return res.status(400).json({
        error: `Cannot delete category. ${toolsCount.count} tool(s) are using this category. Reassign them first.`,
      });
    }

    await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

// ==================== FILE UPLOAD ====================
router.post("/upload", authMiddleware, (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ error: "File too large. Maximum size is 5MB." });
        }
        return res.status(400).json({ error: err.message });
      }
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  });
});

// Delete uploaded file
router.delete("/upload", authMiddleware, (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "File URL is required" });
  }

  const filePath = `.${url}`;
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return res.json({ message: "File deleted successfully" });
  }

  res.status(404).json({ error: "File not found" });
});

export default router;
