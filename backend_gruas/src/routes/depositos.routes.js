import { Router } from "express";
import { createDeposito, getDepositos, getDeposito, updateDeposito, deleteDeposito } from "../controllers/depositos.controllers.js";

const router = Router();

router.post("/depositos", createDeposito);
router.get("/depositos", getDepositos);
router.get("/depositos/:id", getDeposito);
router.put("/depositos/:id", updateDeposito);
router.delete("/depositos/:id", deleteDeposito);

export default router;
