import { Router } from "express";
import { auth } from "../middleware/auth.middleware.js";
import { 
    createInfraccion, 
    getInfracciones,
    getInfraccionById,
    updateInfraccion,
    deleteInfraccion,
    solicitarModificacionPlaca, // Renamed
    solicitarAnulacionInfraccion, // Renamed
    getHistorialInfraccion,
    autorizarCambioInfraccion, // New
    getSolicitudesPendientes // New
} from "../controllers/infracciones.controllers.js";

const router = Router();

// GET all infracciones
router.get("/infracciones", getInfracciones);

// HU007: GET pending change requests
router.get("/infracciones/solicitudes-pendientes", auth, getSolicitudesPendientes);

// HU008: GET infraction history
router.get("/infracciones/:id/historial", auth, getHistorialInfraccion);

// GET a single infraccion by ID
router.get("/infracciones/:id", getInfraccionById);

// POST a new infraccion
router.post("/infracciones", createInfraccion);

// PATCH to update an existing infraccion (e.g., notes)
router.patch("/infracciones/:id", auth, updateInfraccion); // Added auth middleware

// HU007: PATCH to request infraction plate modification
router.patch("/infracciones/:id/solicitar-modificacion-placa", auth, solicitarModificacionPlaca);

// HU007: PATCH to request infraction voiding
router.patch("/infracciones/:id/solicitar-anulacion", auth, solicitarAnulacionInfraccion);

// HU007: PATCH to authorize a change request
router.patch("/infracciones/auditoria/:id_auditoria/autorizar", auth, autorizarCambioInfraccion);

// DELETE an infraccion (soft delete)
router.delete("/infracciones/:id", auth, deleteInfraccion); // Added auth middleware


export default router;