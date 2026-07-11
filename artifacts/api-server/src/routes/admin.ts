import { Router } from "express";

const router = Router();

router.get("/stats", (req, res) => {
  res.json({ message: "Admin route is working!" });
});

export default router;
