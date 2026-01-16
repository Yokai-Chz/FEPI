import { Router } from "express";
import { createInfraccion, getInfracciones } from "../controllers/infracciones.controllers.js";

const router = Router();

router.get("/infracciones", getInfracciones);


router.post("/infracciones", createInfraccion);

export default router;