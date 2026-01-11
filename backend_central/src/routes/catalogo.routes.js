import { Router } from "express";
import { getCatalogo } from "../controllers/catalogo.controllers.js";

const router = Router();

router.get("/catalogo", getCatalogo);

export default router;
