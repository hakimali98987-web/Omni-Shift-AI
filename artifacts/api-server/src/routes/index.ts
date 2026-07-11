import { Router, type IRouter } from "express";
import healthRouter from "./health";
import categoriesRouter from "./categories";
import toolsRouter from "./tools";
import statsRouter from "./stats";

const router: IRouter = Router();

// Existing public routes
router.use(healthRouter);
router.use(categoriesRouter);
router.use(toolsRouter);
router.use(statsRouter);

// Inline admin route (temporary)
const adminRouter = Router();
adminRouter.get("/stats", (req, res) => {
  res.json({ message: "Admin route is working!" });
});
router.use("/admin", adminRouter);

export default router;
