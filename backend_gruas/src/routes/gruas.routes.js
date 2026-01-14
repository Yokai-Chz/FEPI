import { Router } from "express";
import { createGrua, getGruas, getGrua, updateGrua, deleteGrua } from "../controllers/gruas.controllers.js";

const router = Router();

router.post("/gruas", createGrua);
router.get("/gruas", getGruas);
router.get("/gruas/:id", getGrua);
router.put("/gruas/:id", updateGrua);
router.delete("/gruas/:id", deleteGrua);

export default router;
