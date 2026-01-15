import { Router } from "express";
import { createUsuario, getUsuarios, getUsuario, updateUsuario, deleteUsuario } from "../controllers/usuarios_deposito.controllers.js";

const router = Router();

router.post("/usuarios", createUsuario);

router.get("/usuarios", getUsuarios);

router.get("/usuarios/:id", getUsuario);

router.put("/usuarios/:id", updateUsuario);

router.delete("/usuarios/:id", deleteUsuario);

export default router;
