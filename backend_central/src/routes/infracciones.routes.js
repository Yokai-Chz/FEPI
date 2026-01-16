import { Router } from "express";
import { auth } from "../middleware/auth.middleware.js";
import { 
    createInfraccion, 
    getInfracciones,
    getInfraccionById,
    updateInfraccion,
    deleteInfraccion,
    modificarInfraccionPlaca,
    anularInfraccion,
    getHistorialInfraccion
} from "../controllers/infracciones.controllers.js";

const router = Router();

// GET all infracciones
router.get("/infracciones", getInfracciones);

// GET a single infraccion by ID
router.get("/infracciones/:id", getInfraccionById);

// HU008: GET infraction history
router.get("/infracciones/:id/historial", getHistorialInfraccion);

// POST a new infraccion
router.post("/infracciones", createInfraccion);

// PATCH to update an existing infraccion (e.g., notes)
router.patch("/infracciones/:id", updateInfraccion);

// HU007: PATCH to modify infraction plate
router.patch("/infracciones/:id/modificar-placa", auth, modificarInfraccionPlaca);

// HU007: PATCH to void an infraction
router.patch("/infracciones/:id/anular", auth, anularInfraccion);

// DELETE an infraccion (soft delete)
router.delete("/infracciones/:id", deleteInfraccion);


export default router;