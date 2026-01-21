import { Router } from "express";
import { createOficial, getOficiales, getOficial } from "../controllers/oficiales.controllers.js";
import { auth } from "../middleware/auth.middleware.js";

const router = Router();

// Crear un nuevo oficial
router.post("/oficiales", createOficial);

// Obtener la lista de todos los oficiales
router.get("/oficiales", getOficiales);

router.get("/oficiales/:id", getOficial);


export default router;
