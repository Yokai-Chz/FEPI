import { pool } from "../db.js";
import crypto from 'crypto';

export const createFolio = async (req, res) => {
    try {
        const { id_agente } = req.body; 

        const idOficialUUID = crypto.randomUUID(); 

        const query = `
            INSERT INTO "folioInfracciones" ("idOficial")
            VALUES ($1)
            RETURNING *;
        `;
        const values = [idOficialUUID];
        const result = await pool.query(query, values);
        console.log("Folio creado:", result.rows[0]);

        const folioInfraccion = result.rows[0].folio;
        const idOficial = result.rows[0].idOficial;

        return { folioInfraccion, idOficial };

    } catch (error) {
        console.error("Error al crear folio:", error);

        return res.status(500).json({ 
            message: "Error interno del servidor",
            error: error.message 
        });
    }
}