import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.controllers.js";

const router = Router();

router.get("/dashboard/stats", getDashboardStats);

export default router;
