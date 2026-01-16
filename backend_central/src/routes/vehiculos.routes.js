import { Router } from "express";
import { consultarVehiculo } from "../controllers/vehiculos.controllers.js";

const router = Router();

router.get("/vehiculos/:placa", consultarVehiculo);

export default router;
