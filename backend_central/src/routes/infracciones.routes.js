import { Router } from "express";
import { 
    createInfraccion, 
    getInfracciones,
    getInfraccionById,
    updateInfraccion,
    deleteInfraccion
} from "../controllers/infracciones.controllers.js";

const router = Router();

// GET all infracciones
router.get("/infracciones", getInfracciones);

// GET a single infraccion by ID
router.get("/infracciones/:id", getInfraccionById);

// POST a new infraccion
router.post("/infracciones", createInfraccion);

// PATCH to update an existing infraccion (e.g., notes)
router.patch("/infracciones/:id", updateInfraccion);

// DELETE an infraccion (soft delete)
router.delete("/infracciones/:id", deleteInfraccion);


export default router;