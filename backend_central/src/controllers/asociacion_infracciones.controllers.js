import { pool } from "../db.js";
import { getInfraccionCatalogo } from "./catalogo.controllers.js";


export const createAsociacionInfraccion = async (req, res,id_infraccion, infracciones) => {

    for (const articulo of infracciones) {
        try {

            const id_infraccionCatalogo = await getInfraccionCatalogo(req, res, articulo);
            if (!id_infraccion) {
                console.error("ID de infracción no proporcionado");
                return;
            }

            const query = `
                INSERT INTO "asociacion_infracciones" (id_catalogo_infraccion, id_infraccion)
                VALUES ($1, $2)`;

            const values = [
                id_infraccionCatalogo,
                id_infraccion
            ];

            await pool.query(query, values);
        } catch (error) {
            console.error("Error en createAsociacionInfraccion:", error.message);
            if (!res.headersSent) {
                res.status(500).json({ error: "Error al asociar infracciones al folio" });
            }
            return;
        }
    }
}