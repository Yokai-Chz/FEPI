import { Router } from "express";
import { consultarPlaca, registrarPago, getColonias } from "../controllers/parquimetros.controllers.js";

const router = Router();

// Consultar estado de una placa (GET /parquimetros/consulta/A01-AAA)
router.get("/parquimetros/consulta/:placa", consultarPlaca);

// Simular pago de parquímetro (POST /parquimetros/pago)
router.post("/parquimetros/pago", registrarPago);

// Obtener catálogo de colonias (GET /parquimetros/colonias)
router.get("/parquimetros/colonias", getColonias);

export default router;
