import { Router, type IRouter } from "express";
import healthRouter from "./health";
import categoriesRouter from "./categories";
import toolsRouter from "./tools";
import statsRouter from "./stats";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(categoriesRouter);
router.use(toolsRouter);
router.use(statsRouter);
router.use("/admin", adminRouter);

export default router;
