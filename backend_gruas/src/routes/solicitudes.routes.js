import { Router } from "express";
import { createSolicitud, getSolicitudes, updateSolicitudStatus } from "../controllers/solicitudes.controllers.js";

const router = Router();

console.log("Cargando rutas de solicitudes...");

router.post("/solicitudes", createSolicitud);
router.get("/solicitudes", getSolicitudes);
router.put("/solicitudes/:id/status", updateSolicitudStatus);

export default router;
